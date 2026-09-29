const MINUS = '−'
const MIN_HZ = 20
const MAX_HZ = 20000
const COMPRESSION_RANGE_DB = 60

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const trim = (n: number, digits = 1) => String(Number(n.toFixed(digits)))

export const humanize = (value: string) => {
	const text = value.replaceAll('_', ' ')
	return text.charAt(0).toUpperCase() + text.slice(1)
}

export const roomSizeLabel = (size: string) => `${humanize(size)} room`

const IMPULSE_LABELS: Record<string, string> = {
	synthetic: 'Synthetic IR',
	recorded: 'Recorded IR',
	hybrid: 'Hybrid IR',
	procedural: 'Procedural IR',
	none: 'No IR',
}
export const impulseLabel = (type: string) => IMPULSE_LABELS[type] ?? humanize(type)

export const formatSeconds = (s: number) => `${trim(s)} s`
export const formatMs = (ms: number) => `${Math.round(ms)} ms`
export const formatMeters = (m: number) => `${trim(m)} m`
export const formatHz = (hz: number) => (hz >= 1000 ? `${trim(hz / 1000)} kHz` : `${Math.round(hz)} Hz`)
export const formatSigned = (n: number) => (n < 0 ? `${MINUS}${trim(Math.abs(n), 0)}` : trim(n, 0))
export const formatCompression = (thresholdDb: number, ratio: number) =>
	`${formatSigned(thresholdDb)} dB · ${trim(ratio)}:1`

export const formatDuration = (seconds: number) => {
	const total = Math.round(seconds)
	return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

/** Position 0–1 of a frequency on a log scale between 20 Hz and 20 kHz. */
export const logPosition = (hz: number) =>
	clamp01((Math.log10(hz) - Math.log10(MIN_HZ)) / (Math.log10(MAX_HZ) - Math.log10(MIN_HZ)))

/** Bar fill 0–1 for a compressor threshold: deeper threshold, fuller bar. */
export const compressionFill = (thresholdDb: number) => clamp01(-thresholdDb / COMPRESSION_RANGE_DB)

export const describeDirection = (distanceM: number, azimuthDeg: number) => {
	const abs = Math.abs(azimuthDeg)
	let where: string
	if (abs === 0) where = 'straight ahead'
	else if (abs === 180) where = 'directly behind you'
	else where = `${trim(abs)} degrees to the ${azimuthDeg < 0 ? 'left' : 'right'}`
	return `Voice is ${trim(distanceM)} meters away, ${where}`
}
