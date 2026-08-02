import { beforeEach, describe, expect, it, vi } from 'vitest'
import { textToSpeech } from '../../../clients/elevenLabs/text-to-speech.client'
import speechFromText from './index'

vi.mock('../../../clients/elevenLabs/text-to-speech.client', () => ({
	textToSpeech: vi.fn(),
}))

function streamOf(chunks: Uint8Array[]) {
	let i = 0
	return {
		getReader: () => ({
			read: vi.fn(async () => {
				if (i < chunks.length) {
					return { done: false, value: chunks[i++] }
				}
				return { done: true, value: undefined }
			}),
		}),
	}
}

describe('speechFromText', () => {
	beforeEach(() => {
		vi.mocked(textToSpeech).mockReset()
	})

	it('calls the ElevenLabs client with the input text', async () => {
		vi.mocked(textToSpeech).mockResolvedValue(streamOf([]) as never)

		await speechFromText('narrate this')

		expect(textToSpeech).toHaveBeenCalledWith({ text: 'narrate this' })
	})

	it('concatenates multiple stream chunks into a single buffer, in order', async () => {
		const chunkA = new Uint8Array([1, 2, 3])
		const chunkB = new Uint8Array([4, 5])
		vi.mocked(textToSpeech).mockResolvedValue(streamOf([chunkA, chunkB]) as never)

		const result = await speechFromText('narrate this')

		expect(result).toBeInstanceOf(Buffer)
		expect(Array.from(result)).toEqual([1, 2, 3, 4, 5])
	})

	it('returns a single-chunk buffer unchanged', async () => {
		const chunk = new Uint8Array([9, 9, 9])
		vi.mocked(textToSpeech).mockResolvedValue(streamOf([chunk]) as never)

		const result = await speechFromText('narrate this')

		expect(Array.from(result)).toEqual([9, 9, 9])
	})

	it('returns an empty buffer for an empty stream', async () => {
		vi.mocked(textToSpeech).mockResolvedValue(streamOf([]) as never)

		const result = await speechFromText('narrate this')

		expect(result.length).toBe(0)
	})

	it('propagates a rejection from the ElevenLabs client', async () => {
		const error = new Error('elevenlabs down')
		vi.mocked(textToSpeech).mockRejectedValue(error)

		await expect(speechFromText('narrate this')).rejects.toBe(error)
	})

	it('propagates a rejection from a mid-stream read failure', async () => {
		const error = new Error('stream broke')
		vi.mocked(textToSpeech).mockResolvedValue({
			getReader: () => ({
				read: vi.fn().mockRejectedValue(error),
			}),
		} as never)

		await expect(speechFromText('narrate this')).rejects.toBe(error)
	})
})
