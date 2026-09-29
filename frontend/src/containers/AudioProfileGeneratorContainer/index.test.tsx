import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import textToAudioProfile from '../../services/audioConfig/textToAudioProfile'
import AudioProfileGeneratorContainer from './index'

vi.mock('../../services/audioConfig/textToAudioProfile', () => ({ default: vi.fn() }))

const ctx = {
	audioBlobUrl: 'blob:x' as string | null,
	effectsConfig: null as unknown,
	isEffectApplied: false,
	applyEffectsConfig: vi.fn(),
	onResetConfig: vi.fn(),
}
vi.mock('../../contexts/SpatialAudioCtx', () => ({ useSpatialAudio: () => ctx }))

const mockProfile = vi.mocked(textToAudioProfile)
const CONFIG = { acoustic_space: { space_type: 'church' } } as never
const VALID = 'A large stone church'

const textbox = () => screen.getByLabelText('Scene description')
const buildButton = () => screen.getByRole('button', { name: /build space/i })
const resetButton = () => screen.getByRole('button', { name: /reset to dry/i })

describe('AudioProfileGeneratorContainer', () => {
	beforeEach(() => {
		mockProfile.mockReset()
		ctx.applyEffectsConfig.mockReset()
		ctx.onResetConfig.mockReset()
		ctx.audioBlobUrl = 'blob:x'
		ctx.effectsConfig = null
		ctx.isEffectApplied = false
	})

	it('disables Build with no audio, out-of-range text, and enables it otherwise; shows the counter', async () => {
		ctx.audioBlobUrl = null
		const { rerender } = render(<AudioProfileGeneratorContainer />)
		await userEvent.type(textbox(), VALID)
		expect(buildButton()).toBeDisabled()

		ctx.audioBlobUrl = 'blob:x'
		rerender(<AudioProfileGeneratorContainer />)
		expect(buildButton()).toBeEnabled()
		expect(screen.getByText(`${VALID.length} / 100`)).toBeInTheDocument()

		await userEvent.clear(textbox())
		await userEvent.type(textbox(), 'abcd')
		expect(buildButton()).toBeDisabled()
	})

	it('shows the range error only after blur', async () => {
		render(<AudioProfileGeneratorContainer />)
		await userEvent.type(textbox(), 'ab')
		expect(screen.queryByText('Enter 5–100 characters.')).not.toBeInTheDocument()
		await userEvent.tab()
		expect(screen.getByText('Enter 5–100 characters.')).toBeInTheDocument()
	})

	it('fills the field from an example chip without submitting, and focuses it', async () => {
		render(<AudioProfileGeneratorContainer />)

		await userEvent.click(screen.getByRole('button', { name: 'Forest, far away' }))

		expect(textbox()).toHaveValue('Forest, far away')
		expect(textbox()).toHaveFocus()
		expect(mockProfile).not.toHaveBeenCalled()
	})

	it('shows "Building…" while pending and blocks a second submit', async () => {
		let resolve: (v: { success: true; data: never }) => void = () => {}
		mockProfile.mockReturnValue(new Promise((r) => (resolve = r)))
		render(<AudioProfileGeneratorContainer />)
		await userEvent.type(textbox(), VALID)

		await userEvent.click(buildButton())
		const busy = screen.getByRole('button', { name: 'Building…' })
		expect(busy).toBeDisabled()
		await userEvent.click(busy)
		expect(mockProfile).toHaveBeenCalledTimes(1)

		await act(async () => resolve({ success: true, data: CONFIG }))
		await waitFor(() => expect(buildButton()).toBeEnabled())
	})

	it('applies the generated config immediately and shows no Apply button', async () => {
		mockProfile.mockResolvedValue({ success: true, data: CONFIG })
		render(<AudioProfileGeneratorContainer />)
		await userEvent.type(textbox(), VALID)

		await userEvent.click(buildButton())

		await waitFor(() => expect(ctx.applyEffectsConfig).toHaveBeenCalledWith(CONFIG))
		expect(mockProfile).toHaveBeenCalledWith(VALID)
		expect(screen.queryByRole('button', { name: /^apply/i })).not.toBeInTheDocument()
	})

	it.each([
		['returns an error', () => mockProfile.mockResolvedValue({ success: false, error: 'boom' })],
		['throws', () => mockProfile.mockRejectedValue(new Error('network'))],
	])('recovers when the service %s: alert shown, text kept, button re-enabled', async (_n, arrange) => {
		arrange()
		render(<AudioProfileGeneratorContainer />)
		await userEvent.type(textbox(), VALID)

		await userEvent.click(buildButton())

		expect(await screen.findByRole('alert')).toHaveTextContent('Couldn’t build the space')
		expect(screen.getByRole('alert')).toHaveTextContent(
			'The profile service didn’t respond. Your description is kept — try again.',
		)
		expect(textbox()).toHaveValue(VALID)
		expect(buildButton()).toBeEnabled()
		expect(ctx.applyEffectsConfig).not.toHaveBeenCalled()
	})

	it('Retry resubmits and clears the alert on success', async () => {
		mockProfile.mockResolvedValueOnce({ success: false, error: 'boom' })
		mockProfile.mockResolvedValueOnce({ success: true, data: CONFIG })
		render(<AudioProfileGeneratorContainer />)
		await userEvent.type(textbox(), VALID)
		await userEvent.click(buildButton())

		await userEvent.click(await screen.findByRole('button', { name: 'Retry' }))

		await waitFor(() => expect(mockProfile).toHaveBeenCalledTimes(2))
		await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
		expect(ctx.applyEffectsConfig).toHaveBeenCalledWith(CONFIG)
	})

	it('Retry with an invalid description shows the field error and focuses it instead of doing nothing', async () => {
		mockProfile.mockResolvedValue({ success: false, error: 'boom' })
		render(<AudioProfileGeneratorContainer />)
		await userEvent.type(textbox(), VALID)
		await userEvent.click(buildButton())
		const retry = await screen.findByRole('button', { name: 'Retry' })

		await userEvent.clear(textbox())
		await userEvent.type(textbox(), 'ab')
		await userEvent.click(retry)

		expect(mockProfile).toHaveBeenCalledTimes(1)
		expect(screen.getByText('Enter 5–100 characters.')).toBeInTheDocument()
		expect(textbox()).toHaveFocus()
	})

	it('ignores a response that arrives after Reset to dry', async () => {
		let resolve: (v: { success: true; data: never }) => void = () => {}
		mockProfile.mockReturnValue(new Promise((r) => (resolve = r)))
		ctx.isEffectApplied = true
		render(<AudioProfileGeneratorContainer />)
		await userEvent.type(textbox(), VALID)
		await userEvent.click(buildButton())

		await userEvent.click(resetButton())
		await act(async () => resolve({ success: true, data: CONFIG }))

		expect(ctx.onResetConfig).toHaveBeenCalledTimes(1)
		expect(ctx.applyEffectsConfig).not.toHaveBeenCalled()
		expect(buildButton()).toBeEnabled()
	})

	it('Reset to dry is disabled until a profile is applied, then resets', async () => {
		const { rerender } = render(<AudioProfileGeneratorContainer />)
		expect(resetButton()).toBeDisabled()

		ctx.isEffectApplied = true
		rerender(<AudioProfileGeneratorContainer />)
		await userEvent.click(resetButton())

		expect(ctx.onResetConfig).toHaveBeenCalledTimes(1)
	})
})
