import { describe, expect, it } from 'vitest'
import normalize from './index'

const DEFAULTS = {
	spatial_config: {
		listener_position: { x: 0, y: 0, z: 0 },
		source_position: { x: 5, y: 0, z: 0 },
		distance_meters: 5,
		azimuth_degrees: 0,
		elevation_degrees: 0,
		panner_model: 'HRTF',
		distance_model: 'inverse',
		ref_distance: 1,
		rolloff_factor: 1,
		max_distance: 10000,
	},
	acoustic_space: {
		space_type: 'small_room',
		reverb_time_rt60: 0.4,
		damping_factor: 0.3,
		early_reflections_delay_ms: 25,
		room_size_category: 'small',
		surface_material: 'wood',
		impulse_response_type: 'synthetic',
	},
	audio_processing: {
		dry_wet_mix: 0.3,
		high_frequency_damping: 0.3,
		low_cut_frequency_hz: 50,
		high_cut_frequency_hz: 12000,
		air_absorption_enabled: false,
		air_absorption_db_per_meter: 0,
		occlusion_factor: 0,
		compression_threshold_db: -16,
		compression_ratio: 2,
	},
} as const

const FULL_VALID_RAW = {
	spatial_config: {
		listener_position: { x: 1, y: 2, z: 3 },
		source_position: { x: 1.732, y: 0, z: 1 },
		distance_meters: 2,
		azimuth_degrees: 30,
		elevation_degrees: 10,
		panner_model: 'equalpower',
		distance_model: 'linear',
		ref_distance: 2,
		rolloff_factor: 3,
		max_distance: 500,
	},
	acoustic_space: {
		space_type: 'church',
		reverb_time_rt60: 1.8,
		damping_factor: 0.4,
		early_reflections_delay_ms: 50,
		room_size_category: 'medium',
		surface_material: 'stone',
		impulse_response_type: 'recorded',
	},
	audio_processing: {
		dry_wet_mix: 0.5,
		high_frequency_damping: 0.6,
		low_cut_frequency_hz: 100,
		high_cut_frequency_hz: 8000,
		air_absorption_enabled: true,
		air_absorption_db_per_meter: 0.02,
		occlusion_factor: 0.1,
		compression_threshold_db: -18,
		compression_ratio: 4,
	},
}

describe('normalize — malformed top-level input', () => {
	it.each([undefined, null, 'a string', 42, []])('falls back to full defaults for raw=%j', (raw) => {
		expect(normalize(raw)).toEqual(DEFAULTS)
	})

	it('falls back to full defaults for an empty object', () => {
		expect(normalize({})).toEqual(DEFAULTS)
	})
})

describe('normalize — full valid payload passes through unmodified', () => {
	it('returns the exact input values when everything is valid and in-range', () => {
		expect(normalize(FULL_VALID_RAW)).toEqual(FULL_VALID_RAW)
	})
})

describe('normalize — per-section garbage falls back to that section defaults', () => {
	it('spatial_config as a non-object falls back', () => {
		expect(normalize({ spatial_config: 'nope' }).spatial_config).toEqual(DEFAULTS.spatial_config)
	})

	it('acoustic_space as null falls back', () => {
		expect(normalize({ acoustic_space: null }).acoustic_space).toEqual(DEFAULTS.acoustic_space)
	})

	it('audio_processing as an array falls back', () => {
		expect(normalize({ audio_processing: [] }).audio_processing).toEqual(DEFAULTS.audio_processing)
	})
})

describe('normalize — spatial_config numeric clamps', () => {
	it.each([
		['distance_meters', 0.1, 10000, 5, 0, 20000],
		['azimuth_degrees', -180, 180, 0, -200, 200],
		['elevation_degrees', -90, 90, 0, -100, 100],
		['ref_distance', 0.01, 1000, 1, 0, 2000],
		['rolloff_factor', 0, 10, 1, -1, 50],
		['max_distance', 0.1, 100000, 10000, 0, 200000],
	] as const)('%s clamps to [%d, %d], defaults to %d when missing', (field, min, max, def, below, above) => {
		expect(normalize({ spatial_config: { [field]: below } }).spatial_config[field]).toBe(min)
		expect(normalize({ spatial_config: { [field]: above } }).spatial_config[field]).toBe(max)
		expect(normalize({ spatial_config: { [field]: min } }).spatial_config[field]).toBe(min)
		expect(normalize({ spatial_config: { [field]: max } }).spatial_config[field]).toBe(max)
		expect(normalize({ spatial_config: {} }).spatial_config[field]).toBe(def)
		expect(normalize({ spatial_config: { [field]: 'not-a-number' } }).spatial_config[field]).toBe(def)
	})
})

describe('normalize — spatial_config enums', () => {
	it('panner_model accepts valid values, falls back on invalid/missing', () => {
		expect(normalize({ spatial_config: { panner_model: 'equalpower' } }).spatial_config.panner_model).toBe('equalpower')
		expect(normalize({ spatial_config: { panner_model: 'bogus' } }).spatial_config.panner_model).toBe('HRTF')
		expect(normalize({ spatial_config: {} }).spatial_config.panner_model).toBe('HRTF')
	})

	it('distance_model accepts valid values, falls back on invalid/missing', () => {
		expect(normalize({ spatial_config: { distance_model: 'exponential' } }).spatial_config.distance_model).toBe(
			'exponential',
		)
		expect(normalize({ spatial_config: { distance_model: 'bogus' } }).spatial_config.distance_model).toBe('inverse')
		expect(normalize({ spatial_config: {} }).spatial_config.distance_model).toBe('inverse')
	})
})

describe('normalize — listener/source position passthrough (unclamped)', () => {
	it('passes through valid numeric coordinates', () => {
		const result = normalize({
			spatial_config: {
				listener_position: { x: -100, y: 200, z: 0 },
				source_position: { x: 3, y: 4, z: 5 },
			},
		}).spatial_config
		expect(result.listener_position).toEqual({ x: -100, y: 200, z: 0 })
		expect(result.source_position).toEqual({ x: 3, y: 4, z: 5 })
	})

	it('defaults missing/partial coordinates independently', () => {
		const result = normalize({
			spatial_config: { listener_position: { x: 1 } },
		}).spatial_config
		expect(result.listener_position).toEqual({ x: 1, y: 0, z: 0 })
		expect(result.source_position).toEqual({ x: 5, y: 0, z: 0 })
	})

	it('defaults non-numeric coordinates', () => {
		const result = normalize({
			spatial_config: { listener_position: { x: 'a', y: null, z: undefined } },
		}).spatial_config.listener_position
		expect(result).toEqual({ x: 0, y: 0, z: 0 })
	})

	it('defaults when the position object itself is missing or not an object', () => {
		expect(normalize({ spatial_config: { listener_position: 'nope' } }).spatial_config.listener_position).toEqual({
			x: 0,
			y: 0,
			z: 0,
		})
	})
})

describe('normalize — acoustic_space numeric clamps', () => {
	it.each([
		['reverb_time_rt60', 0, 30, 0.4, -5, 50],
		['damping_factor', 0, 1, 0.3, -1, 2],
		['early_reflections_delay_ms', 0, 1000, 25, -10, 2000],
	] as const)('%s clamps to [%d, %d], defaults to %d when missing', (field, min, max, def, below, above) => {
		expect(normalize({ acoustic_space: { [field]: below } }).acoustic_space[field]).toBe(min)
		expect(normalize({ acoustic_space: { [field]: above } }).acoustic_space[field]).toBe(max)
		expect(normalize({ acoustic_space: {} }).acoustic_space[field]).toBe(def)
		expect(normalize({ acoustic_space: { [field]: 'nope' } }).acoustic_space[field]).toBe(def)
	})
})

describe('normalize — acoustic_space enums', () => {
	const SPACE_TYPES = [
		'cathedral',
		'concert_hall',
		'cave',
		'tunnel',
		'hallway',
		'forest',
		'amphitheater',
		'small_room',
		'large_room',
		'distant_room',
		'outdoor',
		'studio',
		'church',
		'bathroom',
		'garage',
		'arena',
	]

	it.each(SPACE_TYPES)('space_type accepts %s', (value) => {
		expect(normalize({ acoustic_space: { space_type: value } }).acoustic_space.space_type).toBe(value)
	})

	it('space_type falls back to small_room on invalid values, including the removed drift values', () => {
		for (const invalid of ['bogus', 'medium_room', 'outdoor_stadium', 'studio_booth', 'underground_parking']) {
			expect(normalize({ acoustic_space: { space_type: invalid } }).acoustic_space.space_type).toBe('small_room')
		}
	})

	it('room_size_category accepts valid values, falls back on invalid/missing', () => {
		expect(normalize({ acoustic_space: { room_size_category: 'huge' } }).acoustic_space.room_size_category).toBe('huge')
		expect(normalize({ acoustic_space: { room_size_category: 'bogus' } }).acoustic_space.room_size_category).toBe(
			'small',
		)
	})

	const SURFACE_MATERIALS = [
		'marble',
		'concrete',
		'wood',
		'brick',
		'glass',
		'carpet',
		'tile',
		'metal',
		'fabric',
		'stone',
		'plaster',
		'grass',
		'dirt',
		'water',
		'sand',
	]

	it.each(SURFACE_MATERIALS)('surface_material accepts %s', (value) => {
		expect(normalize({ acoustic_space: { surface_material: value } }).acoustic_space.surface_material).toBe(value)
	})

	it('surface_material falls back to wood on invalid/missing', () => {
		expect(normalize({ acoustic_space: { surface_material: 'bogus' } }).acoustic_space.surface_material).toBe('wood')
		expect(normalize({ acoustic_space: {} }).acoustic_space.surface_material).toBe('wood')
	})

	it.each([
		'synthetic',
		'recorded',
		'hybrid',
		'procedural',
		'none',
	])('impulse_response_type accepts %s (regression test for the missing "none" fix)', (value) => {
		expect(normalize({ acoustic_space: { impulse_response_type: value } }).acoustic_space.impulse_response_type).toBe(
			value,
		)
	})

	it('impulse_response_type falls back to synthetic on invalid/missing', () => {
		expect(normalize({ acoustic_space: { impulse_response_type: 'bogus' } }).acoustic_space.impulse_response_type).toBe(
			'synthetic',
		)
	})
})

describe('normalize — audio_processing numeric clamps', () => {
	it.each([
		['dry_wet_mix', 0, 1, 0.3, -1, 2],
		['high_frequency_damping', 0, 1, 0.3, -1, 2],
		['low_cut_frequency_hz', 10, 20000, 50, 0, 50000],
		['high_cut_frequency_hz', 10, 20000, 12000, 0, 50000],
		['air_absorption_db_per_meter', 0, 1, 0, -1, 5],
		['occlusion_factor', 0, 1, 0, -1, 5],
		['compression_threshold_db', -60, 0, -16, -100, 10],
		['compression_ratio', 1, 20, 2, 0, 50],
	] as const)('%s clamps to [%d, %d], defaults to %d when missing', (field, min, max, def, below, above) => {
		expect(normalize({ audio_processing: { [field]: below } }).audio_processing[field]).toBe(min)
		expect(normalize({ audio_processing: { [field]: above } }).audio_processing[field]).toBe(max)
		expect(normalize({ audio_processing: {} }).audio_processing[field]).toBe(def)
		expect(normalize({ audio_processing: { [field]: 'nope' } }).audio_processing[field]).toBe(def)
	})
})

describe('normalize — audio_processing boolean', () => {
	it('passes through true/false', () => {
		expect(
			normalize({ audio_processing: { air_absorption_enabled: true } }).audio_processing.air_absorption_enabled,
		).toBe(true)
		expect(
			normalize({ audio_processing: { air_absorption_enabled: false } }).audio_processing.air_absorption_enabled,
		).toBe(false)
	})

	it('defaults to false for non-boolean or missing values', () => {
		expect(
			normalize({ audio_processing: { air_absorption_enabled: 'yes' } }).audio_processing.air_absorption_enabled,
		).toBe(false)
		expect(normalize({ audio_processing: {} }).audio_processing.air_absorption_enabled).toBe(false)
	})
})
