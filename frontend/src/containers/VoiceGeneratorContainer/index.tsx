import { useEffect, useState } from 'react'
import { Actions } from '../../components/Actions'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { Label } from '../../components/Label'
import { Textarea } from '../../components/TextArea'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import textToSpeech from '../../services/voices/textToSpeech'

export default function VoiceGeneratorContainer() {
	const [text, setText] = useState('')
	// const [audioUrl, setAudioUrl] = useState<string | null>(null)

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

		// Limpiar URL anterior para liberar memoria
		if (audioBlobUrl) {
			URL.revokeObjectURL(audioBlobUrl)
			setAudioBlobUrl(null)
		}

		setLoading(true)
		setError(null)

		// Obtener el audio completo como Blob (no es stream)
		const result = await textToSpeech(text)

		if (!result.success) {
			return setError(result.error)
		}
		const newAudioUrl = URL.createObjectURL(result.data)
		setAudioBlobUrl(newAudioUrl)
		setLoading(false)
	}

	return (
		<>
			<h2>Voice generator</h2>
			<form onSubmit={handleOnSubmit}>
				<Label htmlFor="voice-prompt">Voice Prompt</Label>
				<Textarea
					id="voice-prompt"
					onChange={(e) => setText(e.target.value)}
					placeholder="Texto to voice"
					minLength={5}
					maxLength={50}
				/>
				{error && <span>{error}</span>}
				<Actions align="end">
					<Button type="submit" variant="ghost" icon={<Icon name="mic" />}>
						{loading ? 'Generating...' : 'Generate Voice'}
					</Button>
				</Actions>
			</form>
		</>
	)
}
