import type { SpatialAudioConfig } from '@common/types'
import { clamp } from '../../../../common/helpers/validation'
import type { AudioGraph } from '../../types'

const generateSyntheticIR = (audioCtx: AudioContext, reverbTime: number, dampingFactor: number): AudioBuffer => {
	const sr = audioCtx.sampleRate
	const len = Math.floor(sr * reverbTime)
	const buf = audioCtx.createBuffer(2, len, sr)
	for (let ch = 0; ch < 2; ch++) {
		const d = buf.getChannelData(ch)
		for (let i = 0; i < len; i++) {
			const t = i / sr
			d[i] = (Math.random() * 2 - 1) * Math.exp((-3 * t) / reverbTime) * Math.exp(-dampingFactor * t * 10)
		}
	}
	return buf
}

interface BuildAudioGraphSync {
	sourceNode: MediaElementAudioSourceNode
	audioCtx: AudioContext
	effectsConfig: SpatialAudioConfig
}

export const buildAudioGraphSync = ({ sourceNode, audioCtx, effectsConfig }: BuildAudioGraphSync): AudioGraph => {
	const { spatial_config, acoustic_space, audio_processing } = effectsConfig

	// Panner
	const panner = audioCtx.createPanner()
	panner.panningModel = spatial_config.panner_model
	panner.distanceModel = spatial_config.distance_model
	panner.refDistance = spatial_config.ref_distance
	panner.maxDistance = spatial_config.max_distance ?? 10000
	panner.rolloffFactor = spatial_config.rolloff_factor
	panner.coneInnerAngle = 360
	panner.coneOuterAngle = 360
	panner.coneOuterGain = 0

	const sp = spatial_config.source_position
	// panner.setPosition(sp.x, sp.y, sp.z)
	panner.positionX.setValueAtTime(sp.x, 0)
	panner.positionY.setValueAtTime(sp.y, 0)
	panner.positionZ.setValueAtTime(sp.z, 0)

	const lp = spatial_config.listener_position
	// audioCtx.listener.setPosition(lp.x, lp.y, lp.z)
	audioCtx.listener.positionX.setValueAtTime(lp.x, 0)
	audioCtx.listener.positionY.setValueAtTime(lp.y, 0)
	audioCtx.listener.positionZ.setValueAtTime(lp.z, 0)

	// Convolver
	let convolver: ConvolverNode | null = null
	if (acoustic_space.impulse_response_type !== 'none') {
		convolver = audioCtx.createConvolver()
		if (convolver) {
			convolver.normalize = true
			convolver.buffer = generateSyntheticIR(audioCtx, acoustic_space.reverb_time_rt60, acoustic_space.damping_factor)
		}
	}

	// Gains
	const dryGain = audioCtx.createGain()
	const wetGain = audioCtx.createGain()
	const mix = clamp(audio_processing.dry_wet_mix, 0, 1)
	dryGain.gain.value = 1 - mix
	wetGain.gain.value = mix

	// Filtros
	const lowCut = audioCtx.createBiquadFilter()
	lowCut.type = 'highpass'
	lowCut.frequency.value = clamp(audio_processing.low_cut_frequency_hz, 10, 20000)

	const highCut = audioCtx.createBiquadFilter()
	highCut.type = 'lowpass'
	highCut.frequency.value = clamp(audio_processing.high_cut_frequency_hz, 10, 20000)

	const airFilter = audioCtx.createBiquadFilter()
	airFilter.type = 'lowpass'
	const dist = spatial_config.distance_meters
	const airEnabled = audio_processing.air_absorption_enabled
	const dbPerM = audio_processing.air_absorption_db_per_meter ?? 0.05
	airFilter.frequency.value = airEnabled ? Math.max(2000, 20000 / (1 + dist * dbPerM)) : 20000
	airFilter.Q.value = 0.5

	const occlusionFilter = audioCtx.createBiquadFilter()
	occlusionFilter.type = 'lowpass'
	const occ = clamp(audio_processing.occlusion_factor, 0, 1)
	occlusionFilter.frequency.value = 20000 * (1 - occ * 0.9)

	const dampingFilter = audioCtx.createBiquadFilter()
	dampingFilter.type = 'lowpass'
	dampingFilter.frequency.value = 20000 * (1 - clamp(audio_processing.high_frequency_damping, 0, 1))

	const compressor = audioCtx.createDynamicsCompressor()
	compressor.threshold.value = clamp(audio_processing.compression_threshold_db, -100, 0)
	compressor.ratio.value = clamp(audio_processing.compression_ratio, 1, 20)
	compressor.knee.value = 5
	compressor.attack.value = 0.01
	compressor.release.value = 0.1

	const masterGain = audioCtx.createGain()
	masterGain.connect(audioCtx.destination)

	// Conexiones
	sourceNode.connect(lowCut)
	lowCut.connect(highCut)
	highCut.connect(airFilter)
	airFilter.connect(occlusionFilter)
	occlusionFilter.connect(dryGain)
	dryGain.connect(panner)

	if (convolver) {
		occlusionFilter.connect(convolver)
		convolver.connect(dampingFilter)
		dampingFilter.connect(wetGain)
		wetGain.connect(panner)
	}

	panner.connect(compressor)
	compressor.connect(masterGain)

	return {
		context: audioCtx,
		sourceNode,
		panner,
		convolver,
		dryGain,
		wetGain,
		lowCut,
		highCut,
		airFilter,
		occlusionFilter,
		dampingFilter,
		compressor,
		masterGain,
	}
}
