import type { SpatialAudioConfig } from '@common/types'
import { generateStructuredOutput } from '../../../clients/groq/generate-structured-output.client'
import RESPONSE_FORMAT from './config/audio-profile.schema'
import SYSTEM_PROMPT from './config/systemPrompt'
import normalize from './normalize'

// "text": "I want the voice to sound like in a medium size church some meters away from my position on the left"
// const MOCKED_RESULT = {
// 	spatial_config: {
// 		listener_position: {
// 			x: 0,
// 			y: 0,
// 			z: 0,
// 		},
// 		source_position: {
// 			x: -5,
// 			y: 0,
// 			z: 0,
// 		},
// 		distance_meters: 5,
// 		azimuth_degrees: -90,
// 		elevation_degrees: 0,
// 		panner_model: 'HRTF',
// 		distance_model: 'inverse',
// 		ref_distance: 1,
// 		rolloff_factor: 1,
// 		max_distance: 10000,
// 	},
// 	acoustic_space: {
// 		space_type: 'church',
// 		reverb_time_rt60: 1.8,
// 		damping_factor: 0.4,
// 		early_reflections_delay_ms: 50,
// 		room_size_category: 'medium',
// 		surface_material: 'stone',
// 		impulse_response_type: 'synthetic',
// 	},
// 	audio_processing: {
// 		dry_wet_mix: 0.5,
// 		high_frequency_damping: 0.3,
// 		low_cut_frequency_hz: 50,
// 		high_cut_frequency_hz: 12000,
// 		air_absorption_enabled: false,
// 		air_absorption_db_per_meter: 0,
// 		occlusion_factor: 0,
// 		compression_threshold_db: -16,
// 		compression_ratio: 2,
// 	},
// }
// const MOCKED_RESULT = {
// 	spatial_config: {
// 		listener_position: { x: 0, y: 0, z: 0 },
// 		source_position: { x: 1.732, y: 0, z: 1 },
// 		distance_meters: 2,
// 		azimuth_degrees: 30,
// 		elevation_degrees: 0,
// 		panner_model: 'HRTF',
// 		distance_model: 'inverse',
// 		ref_distance: 1,
// 		rolloff_factor: 1,
// 		max_distance: 10000,
// 	},
// 	acoustic_space: {
// 		space_type: 'small_room',
// 		reverb_time_rt60: 0.8,
// 		damping_factor: 0.2,
// 		early_reflections_delay_ms: 30,
// 		room_size_category: 'small',
// 		surface_material: 'concrete',
// 		impulse_response_type: 'synthetic',
// 	},
// 	audio_processing: {
// 		dry_wet_mix: 0.3,
// 		high_frequency_damping: 0.3,
// 		low_cut_frequency_hz: 50,
// 		high_cut_frequency_hz: 12000,
// 		air_absorption_enabled: false,
// 		air_absorption_db_per_meter: 0,
// 		occlusion_factor: 0,
// 		compression_threshold_db: -16,
// 		compression_ratio: 2,
// 	},
// }

export default async function composeAudioProfileFromText(text: string): Promise<SpatialAudioConfig> {
	const rawAnalysis = await generateStructuredOutput({
		system: SYSTEM_PROMPT,
		user: text,
		responseFormat: RESPONSE_FORMAT,
	})

	const result = JSON.parse(rawAnalysis.choices[0].message.content || '{}')

	// const result = MOCKED_RESULT

	return normalize(result)
}
