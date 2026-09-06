import { afterEach, describe, expect, it, vi } from 'vitest'
import textToSpeech from './index'

describe('textToSpeech', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('posts the text and returns the audio blob on success', async () => {
		const blob = new Blob(['fake mp3 bytes'], { type: 'audio/mpeg' })
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			blob: () => Promise.resolve(blob),
		})
		vi.stubGlobal('fetch', fetchMock)

		const result = await textToSpeech('hello there')

		expect(fetchMock).toHaveBeenCalledWith('/api/voices/textToSpeech', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: 'hello there' }),
		})
		expect(result).toEqual({ success: true, data: blob })
	})

	it('returns a failure result with the server message when the response is not ok', async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: false,
			status: 400,
			text: () => Promise.resolve('Text must be at least 3 characters'),
		})
		vi.stubGlobal('fetch', fetchMock)

		const result = await textToSpeech('hi')

		expect(result).toEqual({
			success: false,
			error: 'Error 400: Text must be at least 3 characters',
		})
	})

	it('returns a failure result when fetch itself rejects', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

		const result = await textToSpeech('hello there')

		expect(result).toEqual({ success: false, error: 'network down' })
	})
})
