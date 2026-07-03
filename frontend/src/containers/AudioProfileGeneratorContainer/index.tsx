import { useState } from 'react'
import { Actions } from '../../components/Actions'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Icon } from '../../components/Icon'
import { Label } from '../../components/Label'
import Pre from '../../components/Pre'
import { Textarea } from '../../components/TextArea'
import { useSpatialAudio } from '../../contexts/SpatialAudioCtx'
import textToAudioProfile from '../../services/audioConfig/textToAudioProfile'

export default function AudioProfileGeneratorContainer() {
	const [text, setText] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const { setEffectsConfig, effectsConfig, onApplyConfig, onResetConfig, audioBlobUrl } = useSpatialAudio()

	const parsedEffectsConfig =
		effectsConfig && typeof effectsConfig === 'object' ? JSON.stringify(effectsConfig, null, 2) : ''

	const handleOnChange = (e: React.ChangeEvent) => {
		const inputText = (e.target as HTMLInputElement | HTMLTextAreaElement).value || ''
		setText(inputText)
	}

	const handleOnClick = async () => {
		const response = await textToAudioProfile(text)
		if (!response.success) {
			return setError(response.error)
		}
		setEffectsConfig(response.data)
		setError(null)
	}

	if (!audioBlobUrl) return

	return (
		<Card className="">
			<h2>Audio Profile</h2>
			<Label htmlFor="profile-prompt">Profile Prompt</Label>
			<Textarea
				id="profile-prompt"
				name="profile-prompt"
				placeholder="Describe an audio situation, warmth, clarity, presence, compression..."
				minLength={5}
				maxLength={100}
				onChange={handleOnChange}
			/>
			{error && <span>{error}</span>}
			<Actions align="end">
				<Button
					type="submit"
					disabled={!audioBlobUrl}
					onClick={handleOnClick}
					variant="ghost"
					icon={<Icon name="soundwave" />}
				>
					Generate Profile
				</Button>
			</Actions>

			{/* <AudioProfileConfigContainer /> */}
			{audioBlobUrl && parsedEffectsConfig && (
				<>
					{parsedEffectsConfig && (
						<details>
							<summary>JSON Config</summary>
							<Pre>{parsedEffectsConfig}</Pre>
						</details>
					)}

					<Actions align="between">
						<Button onClick={onResetConfig} variant="ghost" icon={<Icon name="restart" />}>
							Reset
						</Button>
						{/* <div style={{ display: 'flex', gap: 'var(--space-3)' }}> */}
						{/* <Button variant="ghost" icon={<Icon name="bypass" />}>
						Bypass FX
						</Button> */}
						<Button onClick={onApplyConfig} variant="secondary" icon={<Icon name="check" />}>
							Apply
						</Button>
					</Actions>
				</>
			)}
		</Card>
	)
}
