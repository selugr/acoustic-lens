import { useEffect, useState } from 'react'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { Field } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import textToSpeech from '../../services/voices/textToSpeech'

export default function VoiceGeneratorContainer() {
	const [text, setText] = useState('')

	const { setAudioBlobUrl, audioBlobUrl } = useSpatialAudio()

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		return () => {
			if (audioBlobUrl) {
				URL.revokeObjectURL(audioBlobUrl)
			}
		}
	}, [audioBlobUrl])

	const handleOnSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault()
		if (!text.trim()) return

		// Release the previous URL to free memory
		if (audioBlobUrl) {
			URL.revokeObjectURL(audioBlobUrl)
			setAudioBlobUrl(null)
		}

		setLoading(true)
		setError(null)

		try {
			// Full audio as a Blob (not a stream)
			const result = await textToSpeech(text)

			if (!result.success) {
				return setError(result.error)
			}
			setAudioBlobUrl(URL.createObjectURL(result.data))
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleOnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 18 }}>
			<Field
				label="What should the voice say?"
				value={text}
				onChange={setText}
				placeholder="e.g. Meet me by the north door after the service."
				minLength={5}
				maxLength={50}
			/>
			{error && (
				<Alert variant="danger" title="Couldn’t generate the voice">
					{error}
				</Alert>
			)}
			<Button type="submit" fullWidth loading={loading} loadingLabel="Generating…" icon={<Icon name="mic" />}>
				Generate voice
			</Button>
		</form>
	)
}
