import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import styles from './styles.module.css'

export const AudioPlayerContainer: React.FC = () => {
	const { audioRef, audioBlobUrl } = useSpatialAudio()

	if (!audioBlobUrl) {
		return <p className={styles.empty}>Generate or upload a voice to start listening.</p>
	}

	return <audio className={styles.audio} ref={audioRef} src={audioBlobUrl} controls />
}
