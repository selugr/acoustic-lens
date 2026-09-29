import {
	compressionFill,
	formatCompression,
	formatHz,
	formatMeters,
	formatMs,
	formatSeconds,
	humanize,
	impulseLabel,
	logPosition,
	roomSizeLabel,
} from '../formatters'

const MISSING = '—'

export interface SceneView {
	azimuthDeg: number
	elevationDeg: number
	distanceM: number
	pannerModel: string
}

export interface MeterRow {
	label: string
	value: string
	/** Bar fill 0–1, or null when the value is unknown (no bar) */
	fill: number | null
}

export interface ListenView {
	scene: SceneView | null
	space: { title: string; tags: string[]; stats: { label: string; value: string }[] }
	meters: MeterRow[]
}

type Rec = Record<string, unknown>
const asRec = (v: unknown): Rec => (typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as Rec) : {})
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)
const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() !== '' ? v : null)

const withNum = (n: number | null, format: (n: number) => string) => (n === null ? MISSING : format(n))

/** Reads an untrusted profile defensively so the Listen step can never crash on a partial one. */
export function toListenView(config: unknown): ListenView {
	const root = asRec(config)
	const spatial = asRec(root.spatial_config)
	const space = asRec(root.acoustic_space)
	const proc = asRec(root.audio_processing)

	const azimuth = num(spatial.azimuth_degrees)
	const distance = num(spatial.distance_meters)
	const spaceType = str(space.space_type)
	const surface = str(space.surface_material)
	const size = str(space.room_size_category)
	const ir = str(space.impulse_response_type)

	const mix = num(proc.dry_wet_mix)
	const damping = num(proc.high_frequency_damping)
	const occlusion = num(proc.occlusion_factor)
	const lowCut = num(proc.low_cut_frequency_hz)
	const highCut = num(proc.high_cut_frequency_hz)
	const threshold = num(proc.compression_threshold_db)
	const ratio = num(proc.compression_ratio)

	return {
		scene:
			azimuth !== null && distance !== null
				? {
						azimuthDeg: azimuth,
						elevationDeg: num(spatial.elevation_degrees) ?? 0,
						distanceM: distance,
						pannerModel: str(spatial.panner_model) ?? 'HRTF',
					}
				: null,
		space: {
			title: spaceType ? humanize(spaceType) : 'Custom space',
			tags: [surface && humanize(surface), size && roomSizeLabel(size), ir && impulseLabel(ir)].filter(
				(t): t is string => !!t,
			),
			stats: [
				{ label: 'RT60', value: withNum(num(space.reverb_time_rt60), formatSeconds) },
				{ label: 'Pre-delay', value: withNum(num(space.early_reflections_delay_ms), formatMs) },
				{ label: 'Distance', value: withNum(distance, formatMeters) },
			],
		},
		meters: [
			{ label: 'Dry / wet', value: withNum(mix, (n) => `${Math.round(n * 100)}% wet`), fill: mix },
			{ label: 'High-frequency damping', value: withNum(damping, (n) => n.toFixed(2)), fill: damping },
			{ label: 'Occlusion', value: withNum(occlusion, (n) => n.toFixed(2)), fill: occlusion },
			{
				label: 'Low cut',
				value: withNum(lowCut, formatHz),
				fill: lowCut !== null && lowCut > 0 ? logPosition(lowCut) : null,
			},
			{
				label: 'High cut',
				value: withNum(highCut, formatHz),
				fill: highCut !== null && highCut > 0 ? logPosition(highCut) : null,
			},
			{
				label: 'Compression',
				value: threshold !== null && ratio !== null ? formatCompression(threshold, ratio) : MISSING,
				fill: threshold !== null && ratio !== null ? compressionFill(threshold) : null,
			},
		],
	}
}
