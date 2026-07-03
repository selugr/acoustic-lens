// import { useCallback } from 'react'
// import { AudioPlayer } from '../../components/AudioPlayer'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import styles from './styles.module.css'

export const AudioPlayerContainer: React.FC = () => {
	const { audioRef, audioBlobUrl, contextState } = useSpatialAudio()

	// const handlePlay = useCallback(() => {
	// 	if (graph?.context.state === 'suspended') {
	// 		graph.context.resume()
	// 	}
	// }, [graph])

	return (
		<>
			{/* <AudioPlayer currentTime="1:00" isFxOn onPlayClick={() => {}} status="STOP" /> */}
			{audioBlobUrl && (
				<div>
					<audio className={styles.audio} ref={audioRef} src={audioBlobUrl || undefined} controls />
					{contextState && (
						<div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
							Audio Context State:{' '}
							<strong style={{ color: contextState === 'running' ? '#4caf50' : '#ff9800' }}>{contextState}</strong>
						</div>
					)}
				</div>
			)}
		</>
	)
}
