import styles from './styles.module.css'

interface AbCompareProps {
	/** True when the dry side (A) is active */
	bypassed: boolean
	disabled: boolean
	onChange: (bypassed: boolean) => void
}

export function AbCompare({ bypassed, disabled, onChange }: AbCompareProps) {
	// Without a profile there is nothing to compare: B stays selected
	const dryActive = bypassed && !disabled

	return (
		<div role="group" aria-label="Compare" className={styles.group}>
			<button
				type="button"
				aria-pressed={dryActive}
				disabled={disabled}
				className={styles.segment}
				onClick={() => onChange(true)}
			>
				A · Dry
			</button>
			<button
				type="button"
				aria-pressed={!dryActive}
				disabled={disabled}
				className={styles.segment}
				onClick={() => onChange(false)}
			>
				B · Space
			</button>
		</div>
	)
}
