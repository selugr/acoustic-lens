import { useId } from 'react'
import { Icon } from '../Icon'
import styles from './styles.module.css'

interface FieldProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
	label: string
	value: string
	onChange: (value: string) => void
	/** Helper text shown under the textarea */
	hint?: string
	/** Error message; marks the field invalid */
	error?: string | null
	/** Show the `value.length / maxLength` counter (defaults to true when maxLength is set) */
	showCounter?: boolean
}

export function Field({
	label,
	value,
	onChange,
	hint,
	error,
	showCounter,
	id,
	rows = 3,
	maxLength,
	minLength,
	className = '',
	...props
}: FieldProps) {
	const autoId = useId()
	const fieldId = id ?? autoId
	const hintId = `${fieldId}-hint`
	const errorId = `${fieldId}-error`

	const counterVisible = showCounter ?? maxLength !== undefined
	const length = value.length
	const outOfRange =
		(length > 0 && minLength !== undefined && length < minLength) || (maxLength !== undefined && length > maxLength)

	const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

	return (
		<div className={styles.field}>
			<div className={styles.header}>
				<label htmlFor={fieldId} className={styles.label}>
					{label}
				</label>
				{counterVisible && (
					<span className={styles.counter} data-out-of-range={outOfRange}>
						{maxLength !== undefined ? `${length} / ${maxLength}` : length}
					</span>
				)}
			</div>
			<textarea
				{...props}
				id={fieldId}
				rows={rows}
				value={value}
				maxLength={maxLength}
				minLength={minLength}
				onChange={(e) => onChange(e.target.value)}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy}
				className={`${styles.textarea} ${className}`}
			/>
			{hint && (
				<span id={hintId} className={styles.hint}>
					{hint}
				</span>
			)}
			{error && (
				<span id={errorId} className={styles.error}>
					<Icon name="alert-circle" size={14} />
					<span>{error}</span>
				</span>
			)}
		</div>
	)
}
