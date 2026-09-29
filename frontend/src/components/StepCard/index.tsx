import { useId } from 'react'
import { Icon } from '../Icon'
import styles from './styles.module.css'

interface StepCardProps {
	/** Step number shown in the badge */
	step: number
	title: string
	description?: string
	/** Completed: badge shows a check on solid teal */
	done?: boolean
	/** Current step: badge gets a soft teal outline */
	active?: boolean
	/** Right-side slot, e.g. a status chip */
	aside?: React.ReactNode
	children?: React.ReactNode
	className?: string
}

export function StepCard({
	step,
	title,
	description,
	done = false,
	active = false,
	aside,
	children,
	className = '',
}: StepCardProps) {
	const titleId = useId()
	const badgeState = done ? styles.badgeDone : active ? styles.badgeActive : ''

	return (
		<section aria-labelledby={titleId} className={`${styles.card} ${className}`}>
			<div className={styles.header}>
				<div className={`${styles.badge} ${badgeState}`}>
					{done ? (
						<>
							<Icon name="check" size={14} />
							<span className={styles.srOnly}>Step {step} complete</span>
						</>
					) : (
						<span>{step}</span>
					)}
				</div>
				<div className={styles.heading}>
					<h2 id={titleId} className={styles.title}>
						{title}
					</h2>
					{description && <p className={styles.description}>{description}</p>}
				</div>
				{aside && <div className={styles.aside}>{aside}</div>}
			</div>
			{children}
		</section>
	)
}
