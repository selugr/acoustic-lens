import styles from './styles.module.css'

interface LabelProps {
	/** Label text content */
	children: React.ReactNode
	/** Associated form element ID */
	htmlFor?: string
	/** Optional additional CSS class */
	className?: string
}

export function Label({ children, htmlFor, className = '' }: LabelProps) {
	return (
		<label htmlFor={htmlFor} className={`${styles.label} ${className}`}>
			{children}
		</label>
	)
}
