import styles from './styles.module.css'

type StatusTone = 'ready' | 'warning' | 'idle'

interface StatusPillProps {
	tone?: StatusTone
	children: React.ReactNode
}

export function StatusPill({ tone = 'idle', children }: StatusPillProps) {
	return (
		<div className={`${styles.pill} ${styles[tone]}`} data-tone={tone} role="status">
			<span className={styles.dot} aria-hidden="true" />
			<span>{children}</span>
		</div>
	)
}
