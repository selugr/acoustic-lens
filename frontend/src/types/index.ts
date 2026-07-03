export interface AudioGraph {
	context: AudioContext
	sourceNode: MediaElementAudioSourceNode
	panner: PannerNode
	convolver: ConvolverNode | null
	dryGain: GainNode
	wetGain: GainNode
	lowCut: BiquadFilterNode
	highCut: BiquadFilterNode
	airFilter: BiquadFilterNode
	occlusionFilter: BiquadFilterNode
	dampingFilter: BiquadFilterNode
	compressor: DynamicsCompressorNode
	masterGain: GainNode
}
