export interface Vec3 {
	x: number
	y: number
	z: number
}

export type PannerModel = 'equalpower' | 'HRTF'
export type DistanceModel = 'linear' | 'inverse' | 'exponential'
export type SpaceType =
	| 'cathedral'
	| 'concert_hall'
	| 'cave'
	| 'tunnel'
	| 'hallway'
	| 'forest'
	| 'amphitheater'
	| 'small_room'
	| 'large_room'
	| 'distant_room'
	| 'outdoor'
	| 'studio'
	| 'church'
	| 'bathroom'
	| 'garage'
	| 'arena'
export type RoomSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge'
export type SurfaceMaterial =
	| 'marble'
	| 'concrete'
	| 'wood'
	| 'brick'
	| 'glass'
	| 'carpet'
	| 'tile'
	| 'metal'
	| 'fabric'
	| 'stone'
	| 'plaster'
	| 'grass'
	| 'dirt'
	| 'water'
	| 'sand'
export type ImpulseType = 'synthetic' | 'recorded' | 'hybrid' | 'procedural' | 'none'

export interface SpatialConfig {
	listener_position: Vec3
	source_position: Vec3
	distance_meters: number
	azimuth_degrees: number
	elevation_degrees: number
	panner_model: PannerModel
	distance_model: DistanceModel
	ref_distance: number
	rolloff_factor: number
	max_distance?: number
}

export interface AcousticSpace {
	space_type: SpaceType
	reverb_time_rt60: number
	damping_factor: number
	early_reflections_delay_ms: number
	room_size_category: RoomSize
	surface_material: SurfaceMaterial
	impulse_response_type: ImpulseType
	impulse_response_url?: string
}

export interface AudioProcessing {
	dry_wet_mix: number
	high_frequency_damping: number
	low_cut_frequency_hz: number
	high_cut_frequency_hz: number
	air_absorption_enabled: boolean
	air_absorption_db_per_meter?: number
	occlusion_factor: number
	occlusion_filter_freq?: number
	compression_threshold_db: number
	compression_ratio: number
}

export interface SpatialAudioConfig {
	spatial_config: SpatialConfig
	acoustic_space: AcousticSpace
	audio_processing: AudioProcessing
}
