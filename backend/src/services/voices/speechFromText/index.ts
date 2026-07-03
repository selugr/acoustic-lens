import { textToSpeech } from '../../../clients/elevenLabs/text-to-speech.client'

export default async function speechFromText(inputText: string) {
	const speech = await textToSpeech({ text: inputText })

	// TODO Mejora, enviar chunks al cliente
	const reader = speech.getReader()
	const chunks = []
	while (true) {
		const { done, value } = await reader.read()
		if (done) break
		chunks.push(value) // value es un Uint8Array
	}
	// Unir todos los chunks en un solo Buffer
	const audioBuffer = Buffer.concat(chunks)

	return audioBuffer
}
