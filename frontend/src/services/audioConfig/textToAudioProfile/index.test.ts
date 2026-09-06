import type { SpatialAudioConfig } from '@common/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import textToAudioProfile from './index'

const CONFIG: SpatialAudioConfig = {
	spatial_config: {
		listener_position: { x: 0, y: 0, z: 0 },
		source_position: { x: -5, y: 0, z: 0 },
		distance_meters: 5,
		azimuth_degrees: -90,
		elevation_degrees: 0,
		panner_model: 'HRTF',
		distance_model: 'inverse',
		ref_distance: 1,
		rolloff_factor: 1,
		max_distance: 10000,
	},
	acoustic_space: {
		space_type: 'church',
		reverb_time_rt60: 1.8,
		damping_factor: 0.4,
		early_reflections_delay_ms: 50,
		room_size_category: 'medium',
		surface_material: 'stone',
		impulse_response_type: 'synthetic',
	},
	audio_processing: {
		dry_wet_mix: 0.5,
		high_frequency_damping: 0.3,
		low_cut_frequency_hz: 50,
		high_cut_frequency_hz: 12000,
		air_absorption_enabled: false,
		occlusion_factor: 0,
		compression_threshold_db: -16,
		compression_ratio: 2,
	},
}

describe('textToAudioProfile', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('posts the text and returns the parsed spatial audio config on success', async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(CONFIG),
		})
		vi.stubGlobal('fetch', fetchMock)

		const result = await textToAudioProfile('a medium church, a few meters to my left')

		expect(fetchMock).toHaveBeenCalledWith('/api/audio-config/textToAudioProfile', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: 'a medium church, a few meters to my left' }),
		})
		expect(result).toEqual({ success: true, data: CONFIG })
	})

	it('returns a failure result with the server message when the response is not ok', async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: false,
			status: 502,
			text: () => Promise.resolve('groq is down'),
		})
		vi.stubGlobal('fetch', fetchMock)

		const result = await textToAudioProfile('a medium church')

		expect(result).toEqual({ success: false, error: 'Error 502: groq is down' })
	})

	it('returns a failure result when fetch itself rejects', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

		const result = await textToAudioProfile('a medium church')

		expect(result).toEqual({ success: false, error: 'network down' })
	})
})
