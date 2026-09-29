import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SpatialAudioProvider } from '../../contexts/SpatialAudioCtx'
import textToAudioProfile from '../../services/audioConfig/textToAudioProfile'
import MainLayout from './index'

vi.mock('../../services/audioConfig/textToAudioProfile', () => ({ default: vi.fn() }))
vi.mock('../../services/voices/textToSpeech', () => ({ default: vi.fn() }))
vi.mock('../../helpers/audioEngine', () => ({ buildAudioGraphSync: vi.fn() }))

const PROFILE = {
	spatial_config: { distance_meters: 3, azimuth_degrees: 0, elevation_degrees: 0, panner_model: 'HRTF' },
	acoustic_space: {
		space_type: 'church',
		reverb_time_rt60: 2,
		early_reflections_delay_ms: 20,
		room_size_category: 'large',
		surface_material: 'stone',
		impulse_response_type: 'synthetic',
	},
	audio_processing: {
		dry_wet_mix: 0.3,
		high_frequency_damping: 0.2,
		low_cut_frequency_hz: 100,
		high_cut_frequency_hz: 8000,
		occlusion_factor: 0,
		compression_threshold_db: -20,
		compression_ratio: 2,
	},
}
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
		vi.mocked(textToAudioProfile).mockResolvedValue({ success: true, data: PROFILE as never })
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
		expect(screen.getByText('Profile applied')).toBeInTheDocument()
		expect(screen.queryByText('No space yet')).not.toBeInTheDocument()

		await userEvent.click(screen.getByRole('button', { name: /reset to dry/i }))
		await waitFor(() => expect(isDone(2)).toBe(false))
		expect(isActive(2)).toBe(true)
		expect(screen.queryByText('Profile applied')).not.toBeInTheDocument()
		expect(screen.getByText('No space yet')).toBeInTheDocument()
	})
})
