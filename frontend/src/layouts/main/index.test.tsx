import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SpatialAudioProvider } from '../../contexts/SpatialAudioCtx'
import textToAudioProfile from '../../services/audioConfig/textToAudioProfile'
import MainLayout from './index'

vi.mock('../../services/audioConfig/textToAudioProfile', () => ({ default: vi.fn() }))
vi.mock('../../services/voices/textToSpeech', () => ({ default: vi.fn() }))
vi.mock('../../helpers/audioEngine', () => ({ buildAudioGraphSync: vi.fn() }))

const node = { connect: vi.fn(), disconnect: vi.fn() }

const isDone = (n: number) => screen.queryByText(`Step ${n} complete`) !== null
const isActive = (n: number) => {
	if (isDone(n)) return false
	const badge = screen.getByText(String(n))
	return /badgeActive/.test((badge.parentElement as HTMLElement).className)
}

describe('MainLayout step states', () => {
	beforeEach(() => {
		vi.stubGlobal(
			'AudioContext',
			class {
				state = 'running'
				destination = {}
				addEventListener() {}
				removeEventListener() {}
				createMediaElementSource() {
					return node
				}
			},
		)
		URL.createObjectURL = vi.fn(() => 'blob:file')
		URL.revokeObjectURL = vi.fn()
		vi.mocked(textToAudioProfile).mockResolvedValue({ success: true, data: {} as never })
	})

	it('moves Source/Space/Listen through no audio → audio → profile applied → reset', async () => {
		render(
			<SpatialAudioProvider>
				<MainLayout />
			</SpatialAudioProvider>,
		)
		expect([isDone(1), isActive(1), isDone(2), isActive(2), isActive(3)]).toEqual([false, true, false, false, false])

		const file = new File(['a'], 'take.wav', { type: 'audio/wav' })
		fireEvent.drop(screen.getByTestId('dropzone'), { dataTransfer: { files: [file] } })
		await waitFor(() => expect(isDone(1)).toBe(true))
		expect([isDone(2), isActive(2), isActive(3)]).toEqual([false, true, true])

		await userEvent.type(screen.getByLabelText('Scene description'), 'A large stone church')
		await userEvent.click(screen.getByRole('button', { name: /build space/i }))
		await waitFor(() => expect(isDone(2)).toBe(true))

		await userEvent.click(screen.getByRole('button', { name: /reset to dry/i }))
		await waitFor(() => expect(isDone(2)).toBe(false))
		expect(isActive(2)).toBe(true)
	})
})
