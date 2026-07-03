import type { SpatialAudioConfig } from '@common/types'
import type { Service } from '../../types'

export default async function textToAudioProfile(text: string): Service<SpatialAudioConfig> {
	try {
		const response = await fetch('/api/audio-config/textToAudioProfile', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text }),
		})

		if (!response.ok) {
			const errText = await response.text()
			throw new Error(`Error ${response.status}: ${errText}`)
		}

		const config = await response.json()

		return {
			success: true,
			data: config,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Error on generating voice audio',
		}
	}
}
