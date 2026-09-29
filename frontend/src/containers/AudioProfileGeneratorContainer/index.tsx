import { useRef, useState } from 'react'
import { Actions } from '../../components/Actions'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { Field } from '../../components/Field'
import { Icon } from '../../components/Icon'
import Pre from '../../components/Pre'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import textToAudioProfile from '../../services/audioConfig/textToAudioProfile'

const MIN_LENGTH = 5
const MAX_LENGTH = 100
const SCENE_FIELD_ID = 'scene-description'
const EXAMPLES = ['Tiled bathroom, right behind me', 'Concert hall, front row', 'Forest, far away']

export default function AudioProfileGeneratorContainer() {
	const [text, setText] = useState('')
	const [touched, setTouched] = useState(false)
	const [loading, setLoading] = useState(false)
	const [failed, setFailed] = useState(false)
	// Bumped on every new request and on reset; a response only counts if its token is still current
	const requestToken = useRef(0)
	const { effectsConfig, isEffectApplied, applyEffectsConfig, onResetConfig, audioBlobUrl } = useSpatialAudio()

	const length = text.trim().length
	const isValid = length >= MIN_LENGTH && length <= MAX_LENGTH
	const fieldError = touched && !isValid ? `Enter ${MIN_LENGTH}–${MAX_LENGTH} characters.` : null

	const build = async () => {
		if (loading || !isValid || !audioBlobUrl) return

		const token = ++requestToken.current
		setLoading(true)
		setFailed(false)

		try {
			const response = await textToAudioProfile(text)
			if (token !== requestToken.current) return
			if (!response.success) {
				setFailed(true)
				return
			}
			applyEffectsConfig(response.data)
		} catch {
			if (token === requestToken.current) setFailed(true)
		} finally {
			if (token === requestToken.current) setLoading(false)
		}
	}

	const handleReset = () => {
		requestToken.current += 1
		setLoading(false)
		setFailed(false)
		onResetConfig()
	}

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault()
		setTouched(true)
		void build()
	}

	const pickExample = (example: string) => {
		setText(example)
		document.getElementById(SCENE_FIELD_ID)?.focus()
	}

	const parsedEffectsConfig = effectsConfig ? JSON.stringify(effectsConfig, null, 2) : ''

	return (
		<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 18 }}>
			<Field
				id={SCENE_FIELD_ID}
				label="Scene description"
				value={text}
				onChange={setText}
				onBlur={() => setTouched(true)}
				placeholder="e.g. A large stone church, the speaker a few meters to my left."
				error={fieldError}
				minLength={MIN_LENGTH}
				maxLength={MAX_LENGTH}
			/>
			<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
				<span>Try one</span>
				{EXAMPLES.map((example) => (
					<Chip key={example} onClick={() => pickExample(example)}>
						{example}
					</Chip>
				))}
			</div>
			{failed && (
				<Alert
					variant="danger"
					title="Couldn’t build the space"
					action={{ label: 'Retry', onClick: () => void build() }}
				>
					The profile service didn’t respond. Your description is kept — try again.
				</Alert>
			)}
			<Actions align="between">
				<Button variant="ghost" onClick={handleReset} disabled={!isEffectApplied} icon={<Icon name="restart" />}>
					Reset to dry
				</Button>
				<Button
					type="submit"
					loading={loading}
					loadingLabel="Building…"
					disabled={!audioBlobUrl || !isValid}
					icon={<Icon name="sparkle" />}
				>
					Build space
				</Button>
			</Actions>

			{parsedEffectsConfig && (
				<details>
					<summary>JSON Config</summary>
					<Pre>{parsedEffectsConfig}</Pre>
				</details>
			)}
		</form>
	)
}
