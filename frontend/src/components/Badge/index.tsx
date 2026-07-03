import styles from './styles.module.css'

type BadgeVariant = 'accent' | 'muted' | 'danger'

interface BadgeProps {
	/** Visual style variant */
	variant?: BadgeVariant
	/** Optional leading icon element */
	icon?: React.ReactNode
	/** Badge text content */
	children: React.ReactNode
	/** Optional additional CSS class */
	className?: string
}

export function Badge({ variant = 'accent', icon, children, className = '' }: BadgeProps) {
	return (
		<span className={`${styles.badge} ${styles[variant]} ${className}`}>
			{icon && <span className={styles.icon}>{icon}</span>}
			<span className={styles.text}>{children}</span>
		</span>
	)
}
