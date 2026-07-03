import styles from './styles.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Visual style variant */
	variant?: ButtonVariant
	/** Optional leading icon element */
	icon?: React.ReactNode
	/** Button label text */
	children: React.ReactNode
	/** Optional additional CSS class */
	className?: string
}

export function Button({ variant = 'primary', icon, children, className = '', ...props }: ButtonProps) {
	const variantClass = styles[variant] || styles.primary

	return (
		<button className={`${styles.button} ${variantClass} ${className}`} {...props}>
			{icon && <span className={styles.icon}>{icon}</span>}
			<span className={styles.text}>{children}</span>
		</button>
	)
}
