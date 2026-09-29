import { Button } from '../Button'
import { Icon } from '../Icon'
import styles from './styles.module.css'

interface AlertAction {
	label: string
	onClick: () => void
}

interface AlertProps {
	variant: 'danger' | 'warning'
	title?: string
	/** Message body */
	children: React.ReactNode
	/** Optional action button, e.g. Retry */
	action?: AlertAction
	className?: string
}

export function Alert({ variant, title, children, action, className = '' }: AlertProps) {
	return (
		<div role={variant === 'danger' ? 'alert' : 'status'} className={`${styles.alert} ${styles[variant]} ${className}`}>
			{variant === 'danger' ? (
				<Icon name="alert-circle" size={18} className={styles.icon} />
			) : (
				<span className={styles.dot} aria-hidden="true" />
			)}
			<div className={styles.body}>
				{title && <span className={styles.title}>{title}</span>}
				<span className={title ? styles.message : styles.messageOnly}>{children}</span>
			</div>
			{action && (
				<Button variant="secondary" size="sm" onClick={action.onClick}>
					{action.label}
				</Button>
			)}
		</div>
	)
}
