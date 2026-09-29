import type { AcousticSpace } from '@common/types'
import { formatMeters, formatMs, formatSeconds, humanize, impulseLabel, roomSizeLabel } from '../../helpers/formatters'
import { Tag } from '../Chip'
import styles from './styles.module.css'

interface SpaceSummaryProps {
	space: AcousticSpace
	distanceM: number
}

export function SpaceSummary({ space, distanceM }: SpaceSummaryProps) {
	const stats = [
		{ label: 'RT60', value: formatSeconds(space.reverb_time_rt60) },
		{ label: 'Pre-delay', value: formatMs(space.early_reflections_delay_ms) },
		{ label: 'Distance', value: formatMeters(distanceM) },
	]

	return (
		<div className={styles.summary}>
			<h3 className={styles.title}>{humanize(space.space_type)}</h3>
			<div className={styles.tags}>
				<Tag>{humanize(space.surface_material)}</Tag>
				<Tag>{roomSizeLabel(space.room_size_category)}</Tag>
				<Tag>{impulseLabel(space.impulse_response_type)}</Tag>
			</div>
			<dl className={styles.stats}>
				{stats.map((s) => (
					<div key={s.label} className={styles.stat}>
						<dt className={styles.statLabel}>{s.label}</dt>
						<dd className={styles.statValue}>{s.value}</dd>
					</div>
				))}
			</dl>
		</div>
	)
}
