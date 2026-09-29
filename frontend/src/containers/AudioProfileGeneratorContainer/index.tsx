import { useState } from 'react'
import { Actions } from '../../components/Actions'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { Field } from '../../components/Field'
import { Icon } from '../../components/Icon'
import Pre from '../../components/Pre'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import textToAudioProfile from '../../services/audioConfig/textToAudioProfile'

export default function AudioProfileGeneratorContainer() {
	const [text, setText] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const { setEffectsConfig, effectsConfig, onApplyConfig, onResetConfig, audioBlobUrl } = useSpatialAudio()

	const parsedEffectsConfig =
		effectsConfig && typeof effectsConfig === 'object' ? JSON.stringify(effectsConfig, null, 2) : ''

	const handleOnClick = async () => {
		const response = await textToAudioProfile(text)
		if (!response.success) {
			return setError(response.error)
		}
		setEffectsConfig(response.data)
		setError(null)
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
			<Field
				name="profile-prompt"
				label="Scene description"
				value={text}
				onChange={setText}
				placeholder="Describe an audio situation, warmth, clarity, presence, compression..."
				minLength={5}
				maxLength={100}
			/>
			{error && (
				<Alert variant="danger" title="Couldn’t build the space">
					{error}
				</Alert>
			)}
			<Button
				fullWidth
				disabled={!audioBlobUrl}
				onClick={handleOnClick}
				variant="secondary"
				icon={<Icon name="soundwave" />}
			>
				Build space
			</Button>

			{audioBlobUrl && parsedEffectsConfig && (
				<>
					<details>
						<summary>JSON Config</summary>
						<Pre>{parsedEffectsConfig}</Pre>
					</details>

					<Actions align="between">
						<Button onClick={onResetConfig} variant="ghost" icon={<Icon name="restart" />}>
							Reset
						</Button>
						<Button onClick={onApplyConfig} variant="secondary" icon={<Icon name="check" />}>
							Apply
						</Button>
					</Actions>
				</>
			)}
		</div>
	)
}
