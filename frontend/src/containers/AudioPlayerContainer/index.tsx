import { useEffect, useState } from 'react'
import { AbCompare } from '../../components/AbCompare'
import { Alert } from '../../components/Alert'
import { Transport } from '../../components/Transport'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import styles from './styles.module.css'

/** Playback UI. The <audio> element stays mounted (hidden): the Web Audio graph reads from it. */
export const AudioPlayerContainer: React.FC = () => {
	const { audioRef, audioBlobUrl, contextState, isEffectApplied, isBypassed, setBypassed, resumeAudio } =
		useSpatialAudio()
	const [playing, setPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)

	useEffect(() => {
		const el = audioRef.current
		if (!el || !audioBlobUrl) return
		const sync = () => {
			setCurrentTime(el.currentTime)
			setDuration(Number.isFinite(el.duration) ? el.duration : 0)
		}
		const onPlay = () => setPlaying(true)
		const onPause = () => setPlaying(false)
		const events: [string, () => void][] = [
			['loadedmetadata', sync],
			['durationchange', sync],
			['timeupdate', sync],
			['play', onPlay],
			['pause', onPause],
			['ended', onPause],
		]
		for (const [name, handler] of events) el.addEventListener(name, handler)
		sync()
		return () => {
			for (const [name, handler] of events) el.removeEventListener(name, handler)
		}
	}, [audioRef, audioBlobUrl])

	if (!audioBlobUrl) return null

	const handleToggle = async () => {
		const el = audioRef.current
		if (!el) return
		if (playing) {
			el.pause()
			return
		}
		try {
			if (contextState === 'suspended') await resumeAudio()
			await el.play()
		} catch {
			// Playback was blocked or interrupted; the play/pause events keep the UI in sync
		}
	}

	const handleSeek = (seconds: number) => {
		if (!audioRef.current) return
		audioRef.current.currentTime = seconds
		setCurrentTime(seconds)
	}

	return (
		<div className={styles.player}>
			<audio ref={audioRef} src={audioBlobUrl} hidden preload="metadata">
				<track kind="captions" />
			</audio>
			{contextState === 'suspended' && (
				<Alert variant="warning">Audio is paused by the browser. Press play to start the engine.</Alert>
			)}
			<div className={styles.compare}>
				<AbCompare bypassed={isBypassed} disabled={!isEffectApplied} onChange={setBypassed} />
			</div>
			<Transport
				playing={playing}
				currentTime={currentTime}
				duration={duration}
				onToggle={() => void handleToggle()}
				onSeek={handleSeek}
			/>
		</div>
	)
}
