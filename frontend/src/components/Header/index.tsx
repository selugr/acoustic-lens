import styles from './styles.module.css'

interface HeaderProps {
	logo: React.ReactNode
	title: string
	subtitle: string
}

export function Header({ logo, title, subtitle }: HeaderProps) {
	return (
		<header className={styles.header}>
			<div className={styles.brand}>
				<span className={styles.logo} aria-hidden="true">
					{logo}
				</span>
				<span className={styles.title}>{title}</span>
				<span className={styles.divider} aria-hidden="true">
					/
				</span>
				<span className={styles.subtitle}>{subtitle}</span>
			</div>
		</header>
	)
}
