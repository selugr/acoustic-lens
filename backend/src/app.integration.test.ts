import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from './app.mts'
import { textToSpeech } from './clients/elevenLabs/text-to-speech.client'
import { generateStructuredOutput } from './clients/groq/generate-structured-output.client'

vi.mock('./clients/groq/generate-structured-output.client', () => ({
	generateStructuredOutput: vi.fn(),
}))

vi.mock('./clients/elevenLabs/text-to-speech.client', () => ({
	textToSpeech: vi.fn(),
}))

function fakeGroqResponse(content: object) {
	return { choices: [{ message: { content: JSON.stringify(content) } }] } as never
}

function fakeElevenLabsStream(bytes: number[]) {
	let consumed = false
	return {
		getReader: () => ({
			read: vi.fn(async () => {
				if (!consumed) {
					consumed = true
					return { done: false, value: new Uint8Array(bytes) }
				}
				return { done: true, value: undefined }
			}),
		}),
	} as never
}

const app = createApp()

describe('POST /api/audio-config/textToAudioProfile', () => {
	beforeEach(() => {
		vi.mocked(generateStructuredOutput).mockReset()
	})

	it('returns 200 with a normalized spatial audio config on a valid request', async () => {
		vi.mocked(generateStructuredOutput).mockResolvedValue(fakeGroqResponse({ acoustic_space: { space_type: 'cave' } }))

		const res = await request(app).post('/api/audio-config/textToAudioProfile').send({ text: 'a cave far away' })

		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('spatial_config')
		expect(res.body).toHaveProperty('acoustic_space')
		expect(res.body).toHaveProperty('audio_processing')
		expect(res.body.acoustic_space.space_type).toBe('cave')
	})

	it('returns 400 and never calls the Groq client when text is missing', async () => {
		const res = await request(app).post('/api/audio-config/textToAudioProfile').send({})

		expect(res.status).toBe(400)
		expect(res.body).toEqual({ error: 'Text must be at least 3 characters' })
		expect(generateStructuredOutput).not.toHaveBeenCalled()
	})

	it('returns 400 and never calls the Groq client when text is too short', async () => {
		const res = await request(app).post('/api/audio-config/textToAudioProfile').send({ text: 'ab' })

		expect(res.status).toBe(400)
		expect(generateStructuredOutput).not.toHaveBeenCalled()
	})

	it('returns 400 and never calls the Groq client for whitespace-only text', async () => {
		const res = await request(app).post('/api/audio-config/textToAudioProfile').send({ text: '   ' })

		expect(res.status).toBe(400)
		expect(generateStructuredOutput).not.toHaveBeenCalled()
	})

	it('returns 500 when the Groq client rejects', async () => {
		vi.mocked(generateStructuredOutput).mockRejectedValue(new Error('groq down'))

		const res = await request(app).post('/api/audio-config/textToAudioProfile').send({ text: 'a cave far away' })

		expect(res.status).toBe(500)
		expect(res.body).toEqual({ error: 'groq down' })
	})
})

describe('POST /api/voices/textToSpeech', () => {
	beforeEach(() => {
		vi.mocked(textToSpeech).mockReset()
	})

	it('returns 200 with the audio buffer and audio/mpeg content type on a valid request', async () => {
		vi.mocked(textToSpeech).mockResolvedValue(fakeElevenLabsStream([1, 2, 3, 4]))

		const res = await request(app).post('/api/voices/textToSpeech').send({ text: 'hello there' })

		expect(res.status).toBe(200)
		expect(res.headers['content-type']).toBe('audio/mpeg')
		expect(Array.from(res.body as Buffer)).toEqual([1, 2, 3, 4])
	})

	it('returns 400 and never calls the ElevenLabs client when text is missing', async () => {
		const res = await request(app).post('/api/voices/textToSpeech').send({})

		expect(res.status).toBe(400)
		expect(res.body).toEqual({ error: 'Text must be at least 3 characters' })
		expect(textToSpeech).not.toHaveBeenCalled()
	})

	it('returns 400 and never calls the ElevenLabs client for whitespace-only text', async () => {
		const res = await request(app).post('/api/voices/textToSpeech').send({ text: '   ' })

		expect(res.status).toBe(400)
		expect(textToSpeech).not.toHaveBeenCalled()
	})

	it('returns 500 when the ElevenLabs client rejects', async () => {
		vi.mocked(textToSpeech).mockRejectedValue(new Error('elevenlabs down'))

		const res = await request(app).post('/api/voices/textToSpeech').send({ text: 'hello there' })

		expect(res.status).toBe(500)
		expect(res.body).toEqual({ error: 'elevenlabs down' })
	})
})

describe('unrelated routes are unaffected by validateText (regression: it is route-scoped, not global)', () => {
	it('returns Express default 404 for an unknown route, not a 400 from validateText', async () => {
		const res = await request(app).get('/api/nonexistent')

		expect(res.status).toBe(404)
	})
})
