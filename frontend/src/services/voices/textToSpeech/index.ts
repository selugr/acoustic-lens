import type { Service } from '../../types'

export default async function textToSpeech(text: string): Service<Blob> {
	try {
		const response = await fetch('/api/voices/textToSpeech', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text }),
		})

		if (!response.ok) {
			const errText = await response.text()
			throw new Error(`Error ${response.status}: ${errText}`)
		}

		const blob = await response.blob()

		return {
			success: true,
			data: blob,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Error on generating voice audio',
		}
	}
}
