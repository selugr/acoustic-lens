import type { SpatialAudioConfig } from '@common/types'
import { describe, expect, it, vi } from 'vitest'
import { buildAudioGraphSync } from './index'

class MockAudioParam {
	value = 0
	setValueAtTime = vi.fn((v: number) => {
		this.value = v
		return this
	})
}

class MockAudioNode {
	connect = vi.fn()
	disconnect = vi.fn()
}

class MockPannerNode extends MockAudioNode {
	panningModel = ''
	distanceModel = ''
	refDistance = 0
	maxDistance = 0
	rolloffFactor = 0
	coneInnerAngle = 0
	coneOuterAngle = 0
	coneOuterGain = 0
	positionX = new MockAudioParam()
	positionY = new MockAudioParam()
	positionZ = new MockAudioParam()
}

class MockConvolverNode extends MockAudioNode {
	normalize = false
	buffer: unknown = null
}

class MockGainNode extends MockAudioNode {
	gain = new MockAudioParam()
}

class MockBiquadFilterNode extends MockAudioNode {
	type = ''
	frequency = new MockAudioParam()
	Q = new MockAudioParam()
}

class MockDynamicsCompressorNode extends MockAudioNode {
	threshold = new MockAudioParam()
	ratio = new MockAudioParam()
	knee = new MockAudioParam()
	attack = new MockAudioParam()
	release = new MockAudioParam()
}

function createMockAudioContext() {
	return {
		sampleRate: 44100,
		destination: {},
		listener: {
			positionX: new MockAudioParam(),
			positionY: new MockAudioParam(),
			positionZ: new MockAudioParam(),
		},
		createPanner: vi.fn(() => new MockPannerNode()),
		createConvolver: vi.fn(() => new MockConvolverNode()),
		createGain: vi.fn(() => new MockGainNode()),
		createBiquadFilter: vi.fn(() => new MockBiquadFilterNode()),
		createDynamicsCompressor: vi.fn(() => new MockDynamicsCompressorNode()),
		createBuffer: vi.fn((_channels: number, length: number) => ({
			getChannelData: vi.fn(() => new Float32Array(length)),
		})),
	}
}

function buildConfig(overrides: Partial<SpatialAudioConfig> = {}): SpatialAudioConfig {
	return {
		spatial_config: {
			listener_position: { x: 0, y: 0, z: 0 },
			source_position: { x: -5, y: 1, z: 2 },
			distance_meters: 5,
			azimuth_degrees: -90,
			elevation_degrees: 0,
			panner_model: 'HRTF',
			distance_model: 'inverse',
			ref_distance: 1,
			rolloff_factor: 1,
			max_distance: 10000,
			...overrides.spatial_config,
		},
		acoustic_space: {
			space_type: 'church',
			reverb_time_rt60: 1.8,
			damping_factor: 0.4,
			early_reflections_delay_ms: 50,
			room_size_category: 'medium',
			surface_material: 'stone',
			impulse_response_type: 'synthetic',
			...overrides.acoustic_space,
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
			...overrides.audio_processing,
		},
	}
}

describe('buildAudioGraphSync', () => {
	it('configures the panner and listener from the spatial config', () => {
		const audioCtx = createMockAudioContext()
		const sourceNode = new MockAudioNode()
		const config = buildConfig()

		const graph = buildAudioGraphSync({
			sourceNode: sourceNode as unknown as MediaElementAudioSourceNode,
			audioCtx: audioCtx as unknown as AudioContext,
			effectsConfig: config,
		})

		const panner = graph.panner as unknown as MockPannerNode
		expect(panner.panningModel).toBe('HRTF')
		expect(panner.distanceModel).toBe('inverse')
		expect(panner.refDistance).toBe(1)
		expect(panner.rolloffFactor).toBe(1)
		expect(panner.positionX.value).toBe(-5)
		expect(panner.positionY.value).toBe(1)
		expect(panner.positionZ.value).toBe(2)
		expect(audioCtx.listener.positionX.value).toBe(0)
	})

	it('falls back to a max distance of 10000 when not provided', () => {
		const audioCtx = createMockAudioContext()
		const sourceNode = new MockAudioNode()
		const config = buildConfig({ spatial_config: { ...buildConfig().spatial_config, max_distance: undefined } })

		const graph = buildAudioGraphSync({
			sourceNode: sourceNode as unknown as MediaElementAudioSourceNode,
			audioCtx: audioCtx as unknown as AudioContext,
			effectsConfig: config,
		})

		expect((graph.panner as unknown as MockPannerNode).maxDistance).toBe(10000)
	})

	it('creates a convolver and wires the wet path when an impulse response is requested', () => {
		const audioCtx = createMockAudioContext()
		const sourceNode = new MockAudioNode()
		const config = buildConfig()

		const graph = buildAudioGraphSync({
			sourceNode: sourceNode as unknown as MediaElementAudioSourceNode,
			audioCtx: audioCtx as unknown as AudioContext,
			effectsConfig: config,
		})

		expect(audioCtx.createConvolver).toHaveBeenCalledOnce()
		expect(graph.convolver).not.toBeNull()

		const occlusionFilter = graph.occlusionFilter as unknown as MockBiquadFilterNode
		const convolver = graph.convolver as unknown as MockConvolverNode
		const dampingFilter = graph.dampingFilter as unknown as MockBiquadFilterNode
		const wetGain = graph.wetGain as unknown as MockGainNode
		const panner = graph.panner as unknown as MockPannerNode

		expect(occlusionFilter.connect).toHaveBeenCalledWith(convolver)
		expect(convolver.connect).toHaveBeenCalledWith(dampingFilter)
		expect(dampingFilter.connect).toHaveBeenCalledWith(wetGain)
		expect(wetGain.connect).toHaveBeenCalledWith(panner)
	})

	it('skips the convolver and the wet path when impulse_response_type is "none"', () => {
		const audioCtx = createMockAudioContext()
		const sourceNode = new MockAudioNode()
		const config = buildConfig({ acoustic_space: { ...buildConfig().acoustic_space, impulse_response_type: 'none' } })

		const graph = buildAudioGraphSync({
			sourceNode: sourceNode as unknown as MediaElementAudioSourceNode,
			audioCtx: audioCtx as unknown as AudioContext,
			effectsConfig: config,
		})

		expect(audioCtx.createConvolver).not.toHaveBeenCalled()
		expect(graph.convolver).toBeNull()

		const occlusionFilter = graph.occlusionFilter as unknown as MockBiquadFilterNode
		expect(occlusionFilter.connect).toHaveBeenCalledTimes(1)
		expect(occlusionFilter.connect).toHaveBeenCalledWith(graph.dryGain)
	})

	it('splits the dry/wet mix between dryGain and wetGain', () => {
		const audioCtx = createMockAudioContext()
		const sourceNode = new MockAudioNode()
		const config = buildConfig({ audio_processing: { ...buildConfig().audio_processing, dry_wet_mix: 0.3 } })

		const graph = buildAudioGraphSync({
			sourceNode: sourceNode as unknown as MediaElementAudioSourceNode,
			audioCtx: audioCtx as unknown as AudioContext,
			effectsConfig: config,
		})

		expect((graph.dryGain as unknown as MockGainNode).gain.value).toBeCloseTo(0.7)
		expect((graph.wetGain as unknown as MockGainNode).gain.value).toBeCloseTo(0.3)
	})

	it('clamps out-of-range processing values instead of passing them through raw', () => {
		const audioCtx = createMockAudioContext()
		const sourceNode = new MockAudioNode()
		const config = buildConfig({
			audio_processing: {
				...buildConfig().audio_processing,
				dry_wet_mix: 5,
				low_cut_frequency_hz: -100,
				high_cut_frequency_hz: 100000,
				compression_threshold_db: -500,
				compression_ratio: 100,
			},
		})

		const graph = buildAudioGraphSync({
			sourceNode: sourceNode as unknown as MediaElementAudioSourceNode,
			audioCtx: audioCtx as unknown as AudioContext,
			effectsConfig: config,
		})

		expect((graph.wetGain as unknown as MockGainNode).gain.value).toBe(1)
		expect((graph.lowCut as unknown as MockBiquadFilterNode).frequency.value).toBe(10)
		expect((graph.highCut as unknown as MockBiquadFilterNode).frequency.value).toBe(20000)
		expect((graph.compressor as unknown as MockDynamicsCompressorNode).threshold.value).toBe(-100)
		expect((graph.compressor as unknown as MockDynamicsCompressorNode).ratio.value).toBe(20)
	})

	it('wires the dry chain from the source through to the master gain and destination', () => {
		const audioCtx = createMockAudioContext()
		const sourceNode = new MockAudioNode()
		const config = buildConfig()

		const graph = buildAudioGraphSync({
			sourceNode: sourceNode as unknown as MediaElementAudioSourceNode,
			audioCtx: audioCtx as unknown as AudioContext,
			effectsConfig: config,
		})

		const lowCut = graph.lowCut as unknown as MockBiquadFilterNode
		const highCut = graph.highCut as unknown as MockBiquadFilterNode
		const airFilter = graph.airFilter as unknown as MockBiquadFilterNode
		const occlusionFilter = graph.occlusionFilter as unknown as MockBiquadFilterNode
		const dryGain = graph.dryGain as unknown as MockGainNode
		const panner = graph.panner as unknown as MockPannerNode
		const compressor = graph.compressor as unknown as MockDynamicsCompressorNode
		const masterGain = graph.masterGain as unknown as MockGainNode

		expect(sourceNode.connect).toHaveBeenCalledWith(lowCut)
		expect(lowCut.connect).toHaveBeenCalledWith(highCut)
		expect(highCut.connect).toHaveBeenCalledWith(airFilter)
		expect(airFilter.connect).toHaveBeenCalledWith(occlusionFilter)
		expect(occlusionFilter.connect).toHaveBeenCalledWith(dryGain)
		expect(dryGain.connect).toHaveBeenCalledWith(panner)
		expect(panner.connect).toHaveBeenCalledWith(compressor)
		expect(compressor.connect).toHaveBeenCalledWith(masterGain)
		expect(masterGain.connect).toHaveBeenCalledWith(audioCtx.destination)
	})
})
