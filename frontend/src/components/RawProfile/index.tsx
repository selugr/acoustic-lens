import { useEffect, useRef, useState } from 'react'
import { Button } from '../Button'
import { Icon } from '../Icon'
import styles from './styles.module.css'

interface RawProfileProps {
	json: string
}

type CopyState = 'idle' | 'copied' | 'failed'
const RESET_MS = 2000

export function RawProfile({ json }: RawProfileProps) {
	const [copy, setCopy] = useState<CopyState>('idle')
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

	useEffect(() => () => clearTimeout(timer.current), [])

	const handleCopy = async () => {
		let next: CopyState = 'copied'
		try {
			await navigator.clipboard.writeText(json)
		} catch {
			next = 'failed'
		}
		setCopy(next)
		clearTimeout(timer.current)
		timer.current = setTimeout(() => setCopy('idle'), RESET_MS)
	}

	const label = copy === 'copied' ? 'Copied' : copy === 'failed' ? 'Copy failed' : 'Copy'

	return (
		<details className={styles.details}>
			<summary className={styles.summary}>Raw profile (JSON)</summary>
			<div className={styles.body}>
				<Button variant="ghost" size="sm" onClick={() => void handleCopy()} icon={<Icon name="copy" />}>
					{label}
				</Button>
				<pre className={styles.pre}>{json}</pre>
			</div>
		</details>
	)
}
