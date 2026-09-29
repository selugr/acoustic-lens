import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AudioDropZoneContainer } from './index'

const setAudioBlobUrl = vi.fn()
vi.mock('../../contexts/SpatialAudioCtx', () => ({
	useSpatialAudio: () => ({ setAudioBlobUrl }),
}))

describe('AudioDropZoneContainer', () => {
	beforeEach(() => {
		setAudioBlobUrl.mockReset()
		URL.createObjectURL = vi.fn(() => 'blob:file')
		URL.revokeObjectURL = vi.fn()
	})

	it('loads a dropped audio file with its name as the label, leaving revocation to the context', () => {
		render(<AudioDropZoneContainer />)
		const file = new File(['a'], 'take.wav', { type: 'audio/wav' })

		fireEvent.drop(screen.getByTestId('dropzone'), { dataTransfer: { files: [file] } })

		expect(URL.createObjectURL).toHaveBeenCalledWith(file)
		expect(setAudioBlobUrl).toHaveBeenCalledWith('blob:file', 'take.wav')
		expect(URL.revokeObjectURL).not.toHaveBeenCalled()
	})
})
