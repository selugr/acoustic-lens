import type { ChatCompletionCreateParamsStreaming } from 'groq-sdk/resources/chat/completions.mjs'
import { groq } from './base.client'

export type ChatCompletionConfig = Pick<
	ChatCompletionCreateParamsStreaming,
	// 'model' | 'temperature' | 'max_completion_tokens' | 'top_p' | 'stream' | 'stop'
	'model' | 'temperature' | 'max_completion_tokens' | 'top_p' | 'stop'
>

export const baseConfig: ChatCompletionConfig = {
	// model: 'llama-3.1-8b-instant',
	model: 'openai/gpt-oss-20b',
	temperature: 1,
	max_completion_tokens: 2048,
	top_p: 1,
	// stream: true,
	stop: null,
}

export type ResponseFormat = ChatCompletionCreateParamsStreaming['response_format']

interface GenerateStructuredOutput {
	user: string
	system?: string
	config?: ChatCompletionConfig
	responseFormat?: ResponseFormat
}

export async function generateStructuredOutput({
	user,
	system = '',
	responseFormat,
	config,
}: GenerateStructuredOutput) {
	return groq.chat.completions.create({
		messages: [
			{
				role: 'system',
				content: system,
			},
			{
				role: 'user',
				content: user,
			},
		],
		response_format: responseFormat,
		...baseConfig,
		...config,
	})
}
