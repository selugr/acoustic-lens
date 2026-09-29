import { useEffect, useState } from 'react'
import { SourceSummary } from '../../components/SourceSummary'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import { formatDuration } from '../../helpers/formatters'
import { AUDIO_INPUT_ID, VOICE_TEXT_ID } from '../sourceIds'

/** Reads the duration from the blob's metadata; null while unknown or unavailable. */
function useAudioDuration(url: string | null) {
	const [duration, setDuration] = useState<{ url: string; seconds: number } | null>(null)

	useEffect(() => {
		if (!url) return
		const probe = new Audio()
		const onMeta = () => {
			if (Number.isFinite(probe.duration)) setDuration({ url, seconds: probe.duration })
		}
		probe.preload = 'metadata'
		probe.addEventListener('loadedmetadata', onMeta)
		probe.src = url
		return () => {
			probe.removeEventListener('loadedmetadata', onMeta)
			probe.removeAttribute('src')
		}
	}, [url])

	return duration && duration.url === url ? duration.seconds : null
}

interface SourceSummaryContainerProps {
	activeTab: string
}

export function SourceSummaryContainer({ activeTab }: SourceSummaryContainerProps) {
	const { audioBlobUrl, audioLabel } = useSpatialAudio()
	const duration = useAudioDuration(audioBlobUrl)

	if (!audioBlobUrl) return null

	const handleReplace = () => {
		if (activeTab === 'upload') {
			document.getElementById(AUDIO_INPUT_ID)?.click()
		} else {
			document.getElementById(VOICE_TEXT_ID)?.focus()
		}
	}

	return (
		<SourceSummary
			title={audioLabel ?? 'Generated voice'}
			meta={duration === null ? null : formatDuration(duration)}
			onReplace={handleReplace}
		/>
	)
}
