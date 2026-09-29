import type { MeterRow } from '../../helpers/listenView'
import styles from './styles.module.css'

interface ParameterMetersProps {
	rows: MeterRow[]
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export function ParameterMeters({ rows }: ParameterMetersProps) {
	return (
		<div className={styles.meters}>
			{rows.map((row) => {
				const percent = row.fill === null ? null : Math.round(clamp01(row.fill) * 100)
				return (
					<div key={row.label} className={styles.row}>
						<span className={styles.label}>{row.label}</span>
						{percent === null ? (
							<div className={styles.track} aria-hidden="true" />
						) : (
							<div
								role="meter"
								aria-label={row.label}
								aria-valuemin={0}
								aria-valuemax={100}
								aria-valuenow={percent}
								aria-valuetext={row.value}
								className={styles.track}
							>
								<div className={styles.fill} style={{ width: `${percent}%` }} />
							</div>
						)}
						<span className={styles.value}>{row.value}</span>
					</div>
				)
			})}
		</div>
	)
}
