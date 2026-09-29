import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SpatialAudioProvider, useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import textToSpeech from '../../services/voices/textToSpeech'
import VoiceGeneratorContainer from './index'

vi.mock('../../services/voices/textToSpeech', () => ({ default: vi.fn() }))

const mockTts = vi.mocked(textToSpeech)

function Probe() {
	const { audioBlobUrl, audioLabel, setAudioBlobUrl } = useSpatialAudio()
	return (
		<>
			<output data-testid="url">{audioBlobUrl ?? 'none'}</output>
			<output data-testid="label">{audioLabel ?? 'none'}</output>
			<button type="button" onClick={() => setAudioBlobUrl('blob:upload', 'take.wav')}>
				upload
			</button>
		</>
	)
}

describe('VoiceGeneratorContainer with the real audio context', () => {
	beforeEach(() => {
		mockTts.mockReset()
		vi.stubGlobal(
			'AudioContext',
			class {
				state = 'running'
				addEventListener() {}
				removeEventListener() {}
			},
		)
		URL.createObjectURL = vi.fn(() => 'blob:generated')
		URL.revokeObjectURL = vi.fn()
	})

	it('does not overwrite a source loaded while the generation was pending', async () => {
		let resolve: (v: { success: true; data: Blob }) => void = () => {}
		mockTts.mockReturnValue(new Promise((r) => (resolve = r)))
		render(
			<SpatialAudioProvider>
				<VoiceGeneratorContainer />
				<Probe />
			</SpatialAudioProvider>,
		)
		await userEvent.type(screen.getByLabelText('What should the voice say?'), 'Meet me by the north door')
		await userEvent.click(screen.getByRole('button', { name: /generate/i }))

		await userEvent.click(screen.getByRole('button', { name: 'upload' }))
		await act(async () => resolve({ success: true, data: new Blob(['x']) }))

		await waitFor(() => expect(screen.getByRole('button', { name: /generate/i })).toBeEnabled())
		expect(screen.getByTestId('url')).toHaveTextContent('blob:upload')
		expect(screen.getByTestId('label')).toHaveTextContent('take.wav')
		expect(URL.revokeObjectURL).not.toHaveBeenCalledWith('blob:upload')
	})

	it('revokes the previous URL when a generation replaces it', async () => {
		mockTts.mockResolvedValue({ success: true, data: new Blob(['x']) })
		render(
			<SpatialAudioProvider>
				<VoiceGeneratorContainer />
				<Probe />
			</SpatialAudioProvider>,
		)
		await userEvent.click(screen.getByRole('button', { name: 'upload' }))
		await userEvent.type(screen.getByLabelText('What should the voice say?'), 'Meet me by the north door')
		await userEvent.click(screen.getByRole('button', { name: /generate/i }))

		await waitFor(() => expect(screen.getByTestId('url')).toHaveTextContent('blob:generated'))
		expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:upload')
	})
})
