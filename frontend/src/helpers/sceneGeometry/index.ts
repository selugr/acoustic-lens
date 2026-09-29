const MIN_MAX_METERS = 4

/** Ring radii in metres: 1/2/4 m up to 4 m, otherwise max/4, max/2, max. */
export const ringMeters = (distanceM: number): [number, number, number] => {
	const max = Math.max(MIN_MAX_METERS, distanceM)
	return [max / 4, max / 2, max]
}

/**
 * Position of the source relative to the listener (x right, y down, front is up).
 * Distance is scaled so `maxMeters` maps to `radius` and clamped to the outer ring.
 */
export const sourcePoint = (azimuthDeg: number, distanceM: number, maxMeters: number, radius: number) => {
	const ratio = Math.min(1, Math.max(0, distanceM / maxMeters))
	const rad = (azimuthDeg * Math.PI) / 180
	return { x: Math.sin(rad) * radius * ratio, y: -Math.cos(rad) * radius * ratio }
}
