import { Tag } from '../Chip'
import styles from './styles.module.css'

interface SpaceSummaryProps {
	title: string
	tags: string[]
	stats: { label: string; value: string }[]
}

export function SpaceSummary({ title, tags, stats }: SpaceSummaryProps) {
	return (
		<div className={styles.summary}>
			<h3 className={styles.title}>{title}</h3>
			<div className={styles.tags}>
				{tags.map((tag) => (
					<Tag key={tag}>{tag}</Tag>
				))}
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
