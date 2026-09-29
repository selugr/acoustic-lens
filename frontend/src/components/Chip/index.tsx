import styles from './styles.module.css'

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
}

/** Pill button, e.g. a suggestion the user can click. */
export function Chip({ children, className = '', type = 'button', ...props }: ChipProps) {
	return (
		<button {...props} type={type} className={`${styles.chip} ${className}`}>
			{children}
		</button>
	)
}

interface TagProps {
	children: React.ReactNode
	className?: string
}

/** Static label. */
export function Tag({ children, className = '' }: TagProps) {
	return <span className={`${styles.tag} ${className}`}>{children}</span>
}
