import styles from './styles.module.css'

type ActionsAlign = 'start' | 'end' | 'between'

interface ActionsProps {
	/** Button or action elements */
	children: React.ReactNode
	/** Horizontal alignment of actions */
	align?: ActionsAlign
	/** Optional additional CSS class */
	className?: string
	/** Optional inline styles */
	style?: React.CSSProperties
}

export function Actions({ children, align = 'end', className = '' }: ActionsProps) {
	return <div className={`${styles.actions} ${styles[align]} ${className}`}>{children}</div>
}
