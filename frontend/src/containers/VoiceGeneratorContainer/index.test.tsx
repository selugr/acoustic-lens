import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import textToSpeech from '../../services/voices/textToSpeech'
import VoiceGeneratorContainer from './index'

vi.mock('../../services/voices/textToSpeech', () => ({ default: vi.fn() }))
vi.mock('../../contexts/SpatialAudioCtx', () => ({
	useSpatialAudio: () => ({ audioBlobUrl: null, setAudioBlobUrl: vi.fn(), getSourceVersion: () => 0 }),
}))

const mockTts = vi.mocked(textToSpeech)
const VALID = 'Meet me by the north door'

const textbox = () => screen.getByLabelText('What should the voice say?')
const generateButton = () => screen.getByRole('button', { name: /generate/i })

describe('VoiceGeneratorContainer', () => {
	beforeEach(() => {
		mockTts.mockReset()
		URL.createObjectURL = vi.fn(() => 'blob:x')
		URL.revokeObjectURL = vi.fn()
	})

	it('disables Generate below 5 characters and enables it at a valid length', async () => {
		render(<VoiceGeneratorContainer />)
		expect(generateButton()).toBeDisabled()

		await userEvent.type(textbox(), 'abcd')
		expect(generateButton()).toBeDisabled()

		await userEvent.type(textbox(), 'e')
		expect(generateButton()).toBeEnabled()
		expect(screen.getByText('5 / 50')).toBeInTheDocument()
	})

	it('shows the range error only after blur, not while typing', async () => {
		render(<VoiceGeneratorContainer />)
		await userEvent.type(textbox(), 'ab')
		expect(screen.queryByText('Enter 5–50 characters.')).not.toBeInTheDocument()

		await userEvent.tab()
		expect(screen.getByText('Enter 5–50 characters.')).toBeInTheDocument()
	})

	it('disables the button and shows "Generating…" while the request is pending, without double submit', async () => {
		let resolve: (v: { success: true; data: Blob }) => void = () => {}
		mockTts.mockReturnValue(new Promise((r) => (resolve = r)))
		render(<VoiceGeneratorContainer />)
		await userEvent.type(textbox(), VALID)

		await userEvent.click(generateButton())

		const busy = screen.getByRole('button', { name: 'Generating…' })
		expect(busy).toBeDisabled()
		await userEvent.click(busy)
		expect(mockTts).toHaveBeenCalledTimes(1)

		resolve({ success: true, data: new Blob(['x']) })
		await waitFor(() => expect(generateButton()).toBeEnabled())
	})

	it.each([
		['returns an error', () => mockTts.mockResolvedValue({ success: false, error: 'boom' })],
		['throws', () => mockTts.mockRejectedValue(new Error('network'))],
	])('recovers when the service %s: button re-enabled, alert shown, text kept', async (_n, arrange) => {
		arrange()
		render(<VoiceGeneratorContainer />)
		await userEvent.type(textbox(), VALID)

		await userEvent.click(generateButton())

		expect(await screen.findByRole('alert')).toHaveTextContent('Couldn’t generate the voice')
		expect(screen.getByRole('alert')).toHaveTextContent(
			'The speech service didn’t respond. Your text is kept — try again.',
		)
		expect(screen.getByRole('button', { name: 'Generate voice' })).toBeEnabled()
		expect(textbox()).toHaveValue(VALID)
	})

	it('Retry calls the service again', async () => {
		mockTts.mockResolvedValueOnce({ success: false, error: 'boom' })
		mockTts.mockResolvedValueOnce({ success: true, data: new Blob(['x']) })
		render(<VoiceGeneratorContainer />)
		await userEvent.type(textbox(), VALID)
		await userEvent.click(generateButton())

		await userEvent.click(await screen.findByRole('button', { name: 'Retry' }))

		await waitFor(() => expect(mockTts).toHaveBeenCalledTimes(2))
		expect(mockTts).toHaveBeenLastCalledWith(VALID)
		await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
	})
})
