import { describeDirection, formatMeters, formatSigned } from '../../helpers/formatters'
import { ringMeters, sourcePoint } from '../../helpers/sceneGeometry'
import styles from './styles.module.css'

interface SceneDiagramProps {
	/** 0 = front, negative = left */
	azimuthDeg: number
	elevationDeg: number
	distanceM: number
	pannerModel?: string
}

const SIZE = 240
const CENTER = SIZE / 2
const RADIUS = 96

const ringLabel = (m: number) => `${Number(m.toFixed(1))} m`

/** Top-down view of where the voice sits around the listener. */
export function SceneDiagram({ azimuthDeg, elevationDeg, distanceM, pannerModel = 'HRTF' }: SceneDiagramProps) {
	const rings = ringMeters(distanceM)
	const max = rings[2]
	const p = sourcePoint(azimuthDeg, distanceM, max, RADIUS)
	const sx = CENTER + p.x
	const sy = CENTER + p.y

	return (
		<figure className={styles.figure}>
			<svg
				viewBox={`0 0 ${SIZE} ${SIZE}`}
				role="img"
				aria-label={describeDirection(distanceM, azimuthDeg)}
				className={styles.svg}
			>
				{rings.map((m) => (
					<g key={m}>
						<circle cx={CENTER} cy={CENTER} r={(m / max) * RADIUS} className={styles.ring} />
						<text x={CENTER + 4} y={CENTER - (m / max) * RADIUS - 3} className={styles.tick}>
							{ringLabel(m)}
						</text>
					</g>
				))}
				<text x={CENTER} y={12} textAnchor="middle" className={styles.label}>
					Front
				</text>
				<text x={10} y={CENTER + 4} className={styles.label}>
					L
				</text>
				<text x={SIZE - 10} y={CENTER + 4} textAnchor="end" className={styles.label}>
					R
				</text>
				<line x1={CENTER} y1={CENTER} x2={sx} y2={sy} className={styles.line} />
				<line x1={CENTER} y1={CENTER} x2={CENTER} y2={CENTER - 12} className={styles.nose} />
				<circle cx={CENTER} cy={CENTER} r={6} className={styles.listener} />
				<circle cx={sx} cy={sy} r={7} className={styles.source} />
			</svg>
			<figcaption className={styles.caption}>
				{`Az ${formatSigned(azimuthDeg)}° · El ${formatSigned(elevationDeg)}° · ${formatMeters(distanceM)} · ${pannerModel}`}
			</figcaption>
		</figure>
	)
}
