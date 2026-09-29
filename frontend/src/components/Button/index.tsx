import styles from './styles.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'sm'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Visual style variant */
	variant?: ButtonVariant
	/** md = 44px, sm = 36px */
	size?: ButtonSize
	/** Optional leading icon element */
	icon?: React.ReactNode
	/** Busy state: disables the button, sets aria-busy and shows a spinner */
	loading?: boolean
	/** Label shown while loading (defaults to the normal label) */
	loadingLabel?: React.ReactNode
	/** Stretch to the container width */
	fullWidth?: boolean
	/** Button label text */
	children: React.ReactNode
	/** Optional additional CSS class */
	className?: string
}

export function Button({
	variant = 'primary',
	size = 'md',
	icon,
	loading = false,
	loadingLabel,
	fullWidth = false,
	children,
	className = '',
	type = 'button',
	disabled,
	...props
}: ButtonProps) {
	const classes = [styles.button, styles[variant], styles[size], fullWidth ? styles.fullWidth : '', className]
		.filter(Boolean)
		.join(' ')

	return (
		<button
			{...props}
			type={type}
			className={classes}
			disabled={disabled || loading}
			aria-busy={loading ? true : undefined}
		>
			{loading ? (
				<span className={styles.spinner} aria-hidden="true" />
			) : (
				icon && <span className={styles.icon}>{icon}</span>
			)}
			<span className={styles.text}>{loading && loadingLabel ? loadingLabel : children}</span>
		</button>
	)
}
