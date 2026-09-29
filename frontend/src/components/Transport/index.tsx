import { formatDuration } from '../../helpers/formatters'
import { Icon } from '../Icon'
import styles from './styles.module.css'

interface TransportProps {
	playing: boolean
	currentTime: number
	duration: number
	onToggle: () => void
	onSeek: (seconds: number) => void
}

export function Transport({ playing, currentTime, duration, onToggle, onSeek }: TransportProps) {
	const known = Number.isFinite(duration) && duration > 0
	const max = known ? duration : 0
	const percent = known ? Math.min(100, (currentTime / duration) * 100) : 0

	return (
		<div className={styles.transport}>
			<button type="button" className={styles.play} onClick={onToggle} aria-label={playing ? 'Pause' : 'Play'}>
				<Icon name={playing ? 'pause' : 'play'} size={20} />
			</button>
			<span className={styles.time}>{`${formatDuration(currentTime)} / ${formatDuration(max)}`}</span>
			<input
				type="range"
				aria-label="Seek"
				className={styles.seek}
				style={{ '--progress': `${percent}%` } as React.CSSProperties}
				min={0}
				max={max}
				step={0.1}
				value={Math.min(currentTime, max)}
				disabled={!known}
				onChange={(e) => onSeek(Number(e.target.value))}
			/>
		</div>
	)
}
