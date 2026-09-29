import type { AudioProcessing } from '@common/types'
import { compressionFill, formatCompression, formatHz, logPosition } from '../../helpers/formatters'
import styles from './styles.module.css'

interface ParameterMetersProps {
	processing: AudioProcessing
}

interface Row {
	label: string
	value: string
	/** Bar fill, 0–1 */
	fill: number
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export function ParameterMeters({ processing: p }: ParameterMetersProps) {
	const rows: Row[] = [
		{ label: 'Dry / wet', value: `${Math.round(p.dry_wet_mix * 100)}% wet`, fill: p.dry_wet_mix },
		{ label: 'High-frequency damping', value: p.high_frequency_damping.toFixed(2), fill: p.high_frequency_damping },
		{ label: 'Occlusion', value: p.occlusion_factor.toFixed(2), fill: p.occlusion_factor },
		{ label: 'Low cut', value: formatHz(p.low_cut_frequency_hz), fill: logPosition(p.low_cut_frequency_hz) },
		{ label: 'High cut', value: formatHz(p.high_cut_frequency_hz), fill: logPosition(p.high_cut_frequency_hz) },
		{
			label: 'Compression',
			value: formatCompression(p.compression_threshold_db, p.compression_ratio),
			fill: compressionFill(p.compression_threshold_db),
		},
	]

	return (
		<div className={styles.meters}>
			{rows.map((row) => {
				const percent = Math.round(clamp01(row.fill) * 100)
				return (
					<div key={row.label} className={styles.row}>
						<span className={styles.label}>{row.label}</span>
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
						<span className={styles.value}>{row.value}</span>
					</div>
				)
			})}
		</div>
	)
}
