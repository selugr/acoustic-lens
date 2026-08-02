import { beforeEach, describe, expect, it, vi } from 'vitest'
import { generateStructuredOutput } from '../../../clients/groq/generate-structured-output.client'
import RESPONSE_FORMAT from './config/audioProfileSchema'
import SYSTEM_PROMPT from './config/systemPrompt'
import composeAudioProfileFromText from './index'

vi.mock('../../../clients/groq/generate-structured-output.client', () => ({
	generateStructuredOutput: vi.fn(),
}))

function withContent(content: string | null | undefined) {
	return { choices: [{ message: { content } }] } as never
}

describe('composeAudioProfileFromText', () => {
	beforeEach(() => {
		vi.mocked(generateStructuredOutput).mockReset()
	})

	it('calls the Groq client with the system prompt, user text, and response format', async () => {
		vi.mocked(generateStructuredOutput).mockResolvedValue(withContent('{}'))

		await composeAudioProfileFromText('a cave far away')

		expect(generateStructuredOutput).toHaveBeenCalledWith({
			system: SYSTEM_PROMPT,
			user: 'a cave far away',
			responseFormat: RESPONSE_FORMAT,
		})
	})

	it('normalizes the parsed JSON content on the happy path', async () => {
		vi.mocked(generateStructuredOutput).mockResolvedValue(
			withContent(JSON.stringify({ acoustic_space: { space_type: 'cave' } })),
		)

		const result = await composeAudioProfileFromText('a cave far away')

		expect(result.acoustic_space.space_type).toBe('cave')
	})

	it('normalizes to full defaults when message.content is null', async () => {
		vi.mocked(generateStructuredOutput).mockResolvedValue(withContent(null))

		const result = await composeAudioProfileFromText('anything')

		expect(result.acoustic_space.space_type).toBe('small_room')
	})

	it('normalizes to full defaults when message.content is undefined', async () => {
		vi.mocked(generateStructuredOutput).mockResolvedValue(withContent(undefined))

		const result = await composeAudioProfileFromText('anything')

		expect(result.acoustic_space.space_type).toBe('small_room')
	})

	it('rejects when the Groq response content is malformed JSON', async () => {
		vi.mocked(generateStructuredOutput).mockResolvedValue(withContent('not json'))

		await expect(composeAudioProfileFromText('anything')).rejects.toBeInstanceOf(SyntaxError)
	})

	it('propagates a rejection from the Groq client', async () => {
		const error = new Error('network error')
		vi.mocked(generateStructuredOutput).mockRejectedValue(error)

		await expect(composeAudioProfileFromText('anything')).rejects.toBe(error)
	})
})
