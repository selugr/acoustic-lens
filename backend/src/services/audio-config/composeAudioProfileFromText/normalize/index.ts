import { clamp, isBool, isNum, pickEnum } from '@common/helpers/validation'
import type {
	DistanceModel,
	ImpulseType,
	PannerModel,
	RoomSize,
	SpaceType,
	SpatialAudioConfig,
	SurfaceMaterial,
	Vec3,
} from '@common/types'

// const exampleData = {
// 	spatial_config: {
// 		listener_position: { x: 0, y: 0, z: 0 },
// 		source_position: { x: 12, y: 0, z: 0 },
// 		distance_meters: 12,
// 		azimuth_degrees: 30,
// 		elevation_degrees: 0,
// 		panner_model: 'HRTF',
// 		distance_model: 'inverse',
// 		ref_distance: 1,
// 		rolloff_factor: 1,
// 		max_distance: 100,
// 	},
// 	acoustic_space: {
// 		space_type: 'cathedral',
// 		reverb_time_rt60: 3,
// 		damping_factor: 0.2,
// 		early_reflections_delay_ms: 30,
// 		room_size_category: 'medium',
// 		surface_material: 'marble',
// 		impulse_response_type: 'synthetic',
// 	},
// 	audio_processing: {
// 		dry_wet_mix: 0.6,
// 		high_frequency_damping: 0.4,
// 		low_cut_frequency_hz: 100,
// 		high_cut_frequency_hz: 8000,
// 		air_absorption_enabled: true,
// 		air_absorption_db_per_meter: 0.002,
// 		occlusion_factor: 0.1,
// 		compression_threshold_db: -18,
// 		compression_ratio: 4,
// 	},
// }

const DEFAULT_VEC3: Vec3 = { x: 0, y: 0, z: 0 }

const DEFAULT_SPATIAL = {
	listener_position: DEFAULT_VEC3,
	source_position: { x: 5, y: 0, z: 0 },
	distance_meters: 5,
	azimuth_degrees: 0,
	elevation_degrees: 0,
	panner_model: 'HRTF' as PannerModel,
	distance_model: 'inverse' as DistanceModel,
	ref_distance: 1,
	rolloff_factor: 1,
	max_distance: 10000,
} as const

const DEFAULT_ACOUSTIC = {
	space_type: 'small_room' as SpaceType,
	reverb_time_rt60: 0.4,
	damping_factor: 0.3,
	early_reflections_delay_ms: 25,
	room_size_category: 'small' as RoomSize,
	surface_material: 'wood' as SurfaceMaterial,
	impulse_response_type: 'synthetic' as ImpulseType,
} as const

const DEFAULT_PROCESSING = {
	dry_wet_mix: 0.3,
	high_frequency_damping: 0.3,
	low_cut_frequency_hz: 50,
	high_cut_frequency_hz: 12000,
	air_absorption_enabled: false,
	air_absorption_db_per_meter: 0,
	occlusion_factor: 0,
	compression_threshold_db: -16,
	compression_ratio: 2,
} as const

export default function normalize(raw: unknown): SpatialAudioConfig {
	const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}

	// const {
	// 	audio_processing: {
	// 		dry_wet_mix,
	// 		high_frequency_damping,
	// 		low_cut_frequency_hz,
	// 		high_cut_frequency_hz,
	// 		air_absorption_enabled,
	// 		air_absorption_db_per_meter,
	// 		occlusion_factor,
	// 		compression_threshold_db,
	// 		compression_ratio,
	// 	} = {},
	// 	acoustic_space: {
	// 		space_type,
	// 		reverb_time_rt60,
	// 		damping_factor,
	// 		early_reflections_delay_ms,
	// 		room_size_category,
	// 		surface_material,
	// 		impulse_response_type,
	// 	} = {},
	// 	spatial_config: {
	// 		listener_position: {
	// 			x: listener_position_x
	// 			y: listener_position_y
	// 			z: listener_position_z
	// 		} = {},
	// 		source_position: {
	// 			x: source_position_x
	// 			y: source_position_y
	// 			z: source_position_z

	// 		} = {},
	// 		distance_meters,
	// 		azimuth_degrees,
	// 		elevation_degrees,
	// 		panner_model,
	// 		distance_model,
	// 		ref_distance,
	// 		rolloff_factor,
	// 		max_distance,
	// 	} = {}
	// } = data

	// return {
	// 	audio_processing: {
	// 		dry_wet_mix,
	// 		high_frequency_damping,
	// 		low_cut_frequency_hz,
	// 		high_cut_frequency_hz,
	// 		air_absorption_enabled,
	// 		air_absorption_db_per_meter,
	// 		occlusion_factor,
	// 		compression_threshold_db,
	// 		compression_ratio,
	// 	},
	// 	acoustic_space: {
	// 		space_type,
	// 		reverb_time_rt60,
	// 		damping_factor,
	// 		early_reflections_delay_ms,
	// 		room_size_category,
	// 		surface_material,
	// 		impulse_response_type,
	// 	},
	// 	spatial_config: {
	// 		listener_position: {
	// 			x: listener_position_x,
	// 			y: listener_position_y,
	// 			z: listener_position_z
	// 		},
	// 		source_position: {
	// 			x: source_position_x,
	// 			y: source_position_y,
	// 			z: source_position_z
	// 		},
	// 		distance_meters,
	// 		azimuth_degrees,
	// 		elevation_degrees,
	// 		panner_model,
	// 		distance_model,
	// 		ref_distance,
	// 		rolloff_factor,
	// 		max_distance,
	// 	},
	// }

	// SPATIAL CONFIG
	const rawSpatial =
		data.spatial_config && typeof data.spatial_config === 'object'
			? (data.spatial_config as Record<string, unknown>)
			: {}

	const rawListener =
		rawSpatial.listener_position && typeof rawSpatial.listener_position === 'object'
			? (rawSpatial.listener_position as Record<string, unknown>)
			: {}
	const rawSource =
		rawSpatial.source_position && typeof rawSpatial.source_position === 'object'
			? (rawSpatial.source_position as Record<string, unknown>)
			: {}

	const spatial_config = {
		listener_position: {
			x: isNum(rawListener.x) ? rawListener.x : DEFAULT_SPATIAL.listener_position.x,
			y: isNum(rawListener.y) ? rawListener.y : DEFAULT_SPATIAL.listener_position.y,
			z: isNum(rawListener.z) ? rawListener.z : DEFAULT_SPATIAL.listener_position.z,
		},
		source_position: {
			x: isNum(rawSource.x) ? rawSource.x : DEFAULT_SPATIAL.source_position.x,
			y: isNum(rawSource.y) ? rawSource.y : DEFAULT_SPATIAL.source_position.y,
			z: isNum(rawSource.z) ? rawSource.z : DEFAULT_SPATIAL.source_position.z,
		},
		distance_meters: clamp(
			isNum(rawSpatial.distance_meters) ? rawSpatial.distance_meters : DEFAULT_SPATIAL.distance_meters,
			0.1,
			10000,
		),
		azimuth_degrees: clamp(
			isNum(rawSpatial.azimuth_degrees) ? rawSpatial.azimuth_degrees : DEFAULT_SPATIAL.azimuth_degrees,
			-180,
			180,
		),
		elevation_degrees: clamp(
			isNum(rawSpatial.elevation_degrees) ? rawSpatial.elevation_degrees : DEFAULT_SPATIAL.elevation_degrees,
			-90,
			90,
		),
		panner_model: pickEnum(rawSpatial.panner_model, ['equalpower', 'HRTF'], DEFAULT_SPATIAL.panner_model),
		distance_model: pickEnum(
			rawSpatial.distance_model,
			['linear', 'inverse', 'exponential'],
			DEFAULT_SPATIAL.distance_model,
		),
		ref_distance: clamp(
			isNum(rawSpatial.ref_distance) ? rawSpatial.ref_distance : DEFAULT_SPATIAL.ref_distance,
			0.01,
			1000,
		),
		rolloff_factor: clamp(
			isNum(rawSpatial.rolloff_factor) ? rawSpatial.rolloff_factor : DEFAULT_SPATIAL.rolloff_factor,
			0,
			10,
		),
		max_distance: clamp(
			isNum(rawSpatial.max_distance) ? rawSpatial.max_distance : DEFAULT_SPATIAL.max_distance,
			0.1,
			100000,
		),
	}

	// ACOUSTIC SPACE
	const rawAcoustic =
		data.acoustic_space && typeof data.acoustic_space === 'object'
			? (data.acoustic_space as Record<string, unknown>)
			: {}

	const space_type = pickEnum(
		rawAcoustic.space_type,
		[
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
		],
		DEFAULT_ACOUSTIC.space_type,
	)

	const room_size_category = pickEnum(
		rawAcoustic.room_size_category,
		['tiny', 'small', 'medium', 'large', 'huge'],
		DEFAULT_ACOUSTIC.room_size_category,
	)

	const surface_material = pickEnum(
		rawAcoustic.surface_material,
		[
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
		],
		DEFAULT_ACOUSTIC.surface_material,
	)

	const impulse_response_type = pickEnum(
		rawAcoustic.impulse_response_type,
		['synthetic', 'recorded', 'hybrid', 'procedural', 'none'],
		DEFAULT_ACOUSTIC.impulse_response_type,
	)

	const acoustic_space = {
		space_type,
		reverb_time_rt60: clamp(
			isNum(rawAcoustic.reverb_time_rt60) ? rawAcoustic.reverb_time_rt60 : DEFAULT_ACOUSTIC.reverb_time_rt60,
			0,
			30,
		),
		damping_factor: clamp(
			isNum(rawAcoustic.damping_factor) ? rawAcoustic.damping_factor : DEFAULT_ACOUSTIC.damping_factor,
			0,
			1,
		),
		early_reflections_delay_ms: clamp(
			isNum(rawAcoustic.early_reflections_delay_ms)
				? rawAcoustic.early_reflections_delay_ms
				: DEFAULT_ACOUSTIC.early_reflections_delay_ms,
			0,
			1000,
		),
		room_size_category,
		surface_material,
		impulse_response_type,
	}

	// AUDIO PROCESSING
	const rawProcessing =
		data.audio_processing && typeof data.audio_processing === 'object'
			? (data.audio_processing as Record<string, unknown>)
			: {}

	const audio_processing = {
		dry_wet_mix: clamp(
			isNum(rawProcessing.dry_wet_mix) ? rawProcessing.dry_wet_mix : DEFAULT_PROCESSING.dry_wet_mix,
			0,
			1,
		),
		high_frequency_damping: clamp(
			isNum(rawProcessing.high_frequency_damping)
				? rawProcessing.high_frequency_damping
				: DEFAULT_PROCESSING.high_frequency_damping,
			0,
			1,
		),
		low_cut_frequency_hz: clamp(
			isNum(rawProcessing.low_cut_frequency_hz)
				? rawProcessing.low_cut_frequency_hz
				: DEFAULT_PROCESSING.low_cut_frequency_hz,
			10,
			20000,
		),
		high_cut_frequency_hz: clamp(
			isNum(rawProcessing.high_cut_frequency_hz)
				? rawProcessing.high_cut_frequency_hz
				: DEFAULT_PROCESSING.high_cut_frequency_hz,
			10,
			20000,
		),
		air_absorption_enabled: isBool(rawProcessing.air_absorption_enabled)
			? rawProcessing.air_absorption_enabled
			: DEFAULT_PROCESSING.air_absorption_enabled,
		air_absorption_db_per_meter: clamp(
			isNum(rawProcessing.air_absorption_db_per_meter)
				? rawProcessing.air_absorption_db_per_meter
				: DEFAULT_PROCESSING.air_absorption_db_per_meter,
			0,
			1,
		),
		occlusion_factor: clamp(
			isNum(rawProcessing.occlusion_factor) ? rawProcessing.occlusion_factor : DEFAULT_PROCESSING.occlusion_factor,
			0,
			1,
		),
		compression_threshold_db: clamp(
			isNum(rawProcessing.compression_threshold_db)
				? rawProcessing.compression_threshold_db
				: DEFAULT_PROCESSING.compression_threshold_db,
			-60,
			0,
		),
		compression_ratio: clamp(
			isNum(rawProcessing.compression_ratio) ? rawProcessing.compression_ratio : DEFAULT_PROCESSING.compression_ratio,
			1,
			20,
		),
	}

	return { spatial_config, acoustic_space, audio_processing }
}
