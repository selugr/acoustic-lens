import { Button } from '../Button'
import { Icon } from '../Icon'
import styles from './styles.module.css'

interface SourceSummaryProps {
	title: string
	/** Mono meta line, e.g. duration; omitted when unknown */
	meta?: string | null
	onReplace: () => void
}

export function SourceSummary({ title, meta, onReplace }: SourceSummaryProps) {
	return (
		<div className={styles.row}>
			<div className={styles.tile} aria-hidden="true">
				<Icon name="music-note" size={16} />
			</div>
			<div className={styles.text}>
				<span className={styles.title}>{title}</span>
				{meta && (
					<span className={styles.meta} data-testid="source-meta">
						{meta}
					</span>
				)}
			</div>
			<Button variant="secondary" size="sm" onClick={onReplace}>
				Replace
			</Button>
		</div>
	)
}
