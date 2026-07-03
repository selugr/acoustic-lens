import { Icon } from '../Icon'
import styles from './styles.module.css'

interface AudioPlayerProps {
	/** Current playback time display (e.g., "0:00") */
	currentTime?: string
	/** Status message below the time (e.g., "No Audio Loaded") */
	status?: string
	/** Whether the FX badge is shown */
	isFxOn?: boolean
	/** Callback when the play button is clicked */
	onPlayClick?: () => void
	/** Optional additional CSS class */
	className?: string
}

export function AudioPlayer({
	currentTime = '0:00',
	status = 'No Audio Loaded',
	isFxOn = false,
	onPlayClick = () => {},
}) {
	return (
		<div className={styles.playerBar}>
			<div className={styles.left}>
				<button className={styles.playButton} aria-label="Play audio" onClick={onPlayClick} type="button">
					<Icon name="play" />
				</button>
				<div className={styles.info}>
					<span className={styles.time}>{currentTime}</span>
					<span className={styles.status}>{status}</span>
				</div>
			</div>

			<div className={styles.right}>
				{isFxOn && (
					<span className={styles.fxBadge}>
						<span className={styles.fxDot} aria-hidden="true" />
						FX ON
					</span>
				)}
			</div>
		</div>
	)
}
