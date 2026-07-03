import type { BodyTextToSpeechFull } from '@elevenlabs/elevenlabs-js/api'
import { elevenlabs } from './base.client'

export type BodyTextToSpeechConfig = Pick<BodyTextToSpeechFull, 'modelId' | 'outputFormat'>

export const baseConfig: BodyTextToSpeechConfig = {
	modelId: 'eleven_multilingual_v2',
	outputFormat: 'mp3_44100_128',
}

interface TextToSpeech {
	text: string
	config?: BodyTextToSpeechConfig
}

// TODO Switch to stream for speed enhancement
export async function textToSpeech({ text, config }: TextToSpeech) {
	const { data, rawResponse } = await elevenlabs.textToSpeech
		.convert(
			'JBFqnCBsd6RMkjVDRZzb', // voice_id
			{
				text,
				...baseConfig,
				...config,
			},
		)
		.withRawResponse()

	// Access character cost from headers
	const charCost = rawResponse.headers.get('character-cost')
	// Optionally store these for debugging
	const requestId = rawResponse.headers.get('request-id')
	const traceId = rawResponse.headers.get('x-trace-id')
	console.log('charCost', charCost)
	console.log('requestId', requestId)
	console.log('traceId', traceId)

	return data
	// await play(audio)
}
