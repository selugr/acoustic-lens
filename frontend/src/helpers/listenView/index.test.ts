import { describe, expect, it } from 'vitest'
import { toListenView } from './index'

const full = {
	spatial_config: { distance_meters: 3.2, azimuth_degrees: -60, elevation_degrees: 5, panner_model: 'HRTF' },
	acoustic_space: {
		space_type: 'concert_hall',
		reverb_time_rt60: 2.4,
		early_reflections_delay_ms: 38,
		room_size_category: 'large',
		surface_material: 'wood',
		impulse_response_type: 'synthetic',
	},
	audio_processing: {
		dry_wet_mix: 0.35,
		high_frequency_damping: 0.4,
		low_cut_frequency_hz: 120,
		high_cut_frequency_hz: 9500,
		occlusion_factor: 0.1,
		compression_threshold_db: -18,
		compression_ratio: 3,
	},
}

describe('toListenView', () => {
	it('normalizes a full profile', () => {
		const v = toListenView(full)
		expect(v.scene).toEqual({ azimuthDeg: -60, elevationDeg: 5, distanceM: 3.2, pannerModel: 'HRTF' })
		expect(v.space.title).toBe('Concert hall')
		expect(v.space.tags).toEqual(['Wood', 'Large room', 'Synthetic IR'])
		expect(v.space.stats).toEqual([
			{ label: 'RT60', value: '2.4 s' },
			{ label: 'Pre-delay', value: '38 ms' },
			{ label: 'Distance', value: '3.2 m' },
		])
		expect(v.meters.map((m) => [m.label, m.value])).toEqual([
			['Dry / wet', '35% wet'],
			['High-frequency damping', '0.40'],
			['Occlusion', '0.10'],
			['Low cut', '120 Hz'],
			['High cut', '9.5 kHz'],
			['Compression', '−18 dB · 3:1'],
		])
		expect(v.meters.every((m) => m.fill !== null)).toBe(true)
	})

	it.each([[{}], [null], [undefined], ['text'], [42]])('survives %j', (input) => {
		const v = toListenView(input)
		expect(v.scene).toBeNull()
		expect(v.space.title).toBe('Custom space')
		expect(v.space.tags).toEqual([])
		expect(v.space.stats.map((s) => s.value)).toEqual(['—', '—', '—'])
		expect(v.meters).toHaveLength(6)
		expect(v.meters.every((m) => m.value === '—' && m.fill === null)).toBe(true)
	})

	it('ignores wrong types field by field and keeps the valid ones', () => {
		const v = toListenView({
			spatial_config: { distance_meters: '3', azimuth_degrees: 10 },
			acoustic_space: {
				space_type: 7,
				reverb_time_rt60: Number.NaN,
				surface_material: 'tile',
				early_reflections_delay_ms: 20,
			},
			audio_processing: { dry_wet_mix: 'x', low_cut_frequency_hz: 100, compression_ratio: 2 },
		})
		expect(v.scene).toBeNull()
		expect(v.space.title).toBe('Custom space')
		expect(v.space.tags).toEqual(['Tile'])
		expect(v.space.stats.map((s) => s.value)).toEqual(['—', '20 ms', '—'])
		const byLabel = Object.fromEntries(v.meters.map((m) => [m.label, m]))
		expect(byLabel['Dry / wet']).toMatchObject({ value: '—', fill: null })
		expect(byLabel['Low cut']).toMatchObject({ value: '100 Hz' })
		expect(byLabel.Compression).toMatchObject({ value: '—', fill: null })
	})

	it('shows the scene with defaults when only azimuth and distance are valid', () => {
		expect(toListenView({ spatial_config: { distance_meters: 2, azimuth_degrees: 0 } }).scene).toEqual({
			azimuthDeg: 0,
			elevationDeg: 0,
			distanceM: 2,
			pannerModel: 'HRTF',
		})
	})
})
