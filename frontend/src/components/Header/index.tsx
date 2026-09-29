import styles from './styles.module.css'

interface HeaderProps {
	title: string
	subtitle: string
	/** Right-side slot, e.g. the engine StatusPill */
	status?: React.ReactNode
}

export function Header({ title, subtitle, status }: HeaderProps) {
	return (
		<header className={styles.header}>
			<div className={styles.brand}>
				<span className={styles.logo} aria-hidden="true">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.2"
						strokeLinecap="round"
					>
						<path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 11v2M21 12h0" />
					</svg>
				</span>
				<span className={styles.title}>{title}</span>
				<span className={styles.divider} aria-hidden="true">
					/
				</span>
				<span className={styles.subtitle}>{subtitle}</span>
			</div>
			{status}
		</header>
	)
}
