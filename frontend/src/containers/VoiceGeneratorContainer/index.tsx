import { useState } from 'react'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { Field } from '../../components/Field'
import { Icon } from '../../components/Icon'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import textToSpeech from '../../services/voices/textToSpeech'
import { VOICE_TEXT_ID } from '../sourceIds'

const MIN_LENGTH = 5
const MAX_LENGTH = 50

export default function VoiceGeneratorContainer() {
	const [text, setText] = useState('')
	const [touched, setTouched] = useState(false)
	const [loading, setLoading] = useState(false)
	const [failed, setFailed] = useState(false)

	const { setAudioBlobUrl, audioBlobUrl } = useSpatialAudio()

	const length = text.trim().length
	const isValid = length >= MIN_LENGTH && length <= MAX_LENGTH
	const fieldError = touched && !isValid ? `Enter ${MIN_LENGTH}–${MAX_LENGTH} characters.` : null

	const generate = async () => {
		if (loading || !isValid) return

		setLoading(true)
		setFailed(false)

		try {
			// Full audio as a Blob (not a stream)
			const result = await textToSpeech(text)
			if (!result.success) {
				setFailed(true)
				return
			}
			// Release the previous URL to free memory
			if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl)
			setAudioBlobUrl(URL.createObjectURL(result.data))
		} catch {
			setFailed(true)
		} finally {
			setLoading(false)
		}
	}

	const handleOnSubmit = (e: React.SubmitEvent) => {
		e.preventDefault()
		setTouched(true)
		void generate()
	}

	return (
		<form onSubmit={handleOnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 18 }}>
			<Field
				id={VOICE_TEXT_ID}
				label="What should the voice say?"
				value={text}
				onChange={setText}
				onBlur={() => setTouched(true)}
				placeholder="e.g. Meet me by the north door after the service."
				hint="5–50 characters"
				error={fieldError}
				minLength={MIN_LENGTH}
				maxLength={MAX_LENGTH}
			/>
			{failed && (
				<Alert
					variant="danger"
					title="Couldn’t generate the voice"
					action={{ label: 'Retry', onClick: () => void generate() }}
				>
					The speech service didn’t respond. Your text is kept — try again.
				</Alert>
			)}
			<Button
				type="submit"
				fullWidth
				loading={loading}
				disabled={!isValid}
				loadingLabel="Generating…"
				icon={<Icon name="soundwave" />}
			>
				Generate voice
			</Button>
		</form>
	)
}
