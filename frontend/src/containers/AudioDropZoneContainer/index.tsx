import { DropZone } from '../../components/DropZone'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import { AUDIO_INPUT_ID } from '../sourceIds'
import styles from './styles.module.css'

export const AudioDropZoneContainer: React.FC = () => {
	const { setAudioBlobUrl, audioBlobUrl } = useSpatialAudio()

	const handleFile = (file: File) => {
		if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl)
		setAudioBlobUrl(URL.createObjectURL(file), file.name)
	}

	return (
		<div className={styles.wrapper}>
			<DropZone inputId={AUDIO_INPUT_ID} onFile={handleFile} />
		</div>
	)
}
