import type { NextFunction, Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { voicesService } from '../../services/voices/service'
import textToSpeech from './controller'

vi.mock('../../services/voices/service', () => ({
	voicesService: {
		speechFromText: vi.fn(),
	},
}))

function mockRes() {
	const res: Partial<Response> = {}
	res.setHeader = vi.fn().mockReturnValue(res)
	res.status = vi.fn().mockReturnValue(res)
	res.send = vi.fn().mockReturnValue(res)
	return res as Response
}

describe('voices controller (textToSpeech)', () => {
	beforeEach(() => {
		vi.mocked(voicesService.speechFromText).mockReset()
	})

	it('sends the audio buffer with the correct headers on success', async () => {
		const buffer = Buffer.from('fake mp3 bytes')
		vi.mocked(voicesService.speechFromText).mockResolvedValue(buffer)

		const req = { body: { text: 'hello there' } } as Request
		const res = mockRes()
		const next = vi.fn() as NextFunction

		await textToSpeech(req, res, next)

		expect(voicesService.speechFromText).toHaveBeenCalledWith('hello there')
		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'audio/mpeg')
		expect(res.setHeader).toHaveBeenCalledWith('Content-Length', buffer.length)
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.send).toHaveBeenCalledWith(buffer)
		expect(next).not.toHaveBeenCalled()
	})

	it('forwards a service rejection to next(error) without sending a response', async () => {
		const error = new Error('elevenlabs failure')
		vi.mocked(voicesService.speechFromText).mockRejectedValue(error)

		const req = { body: { text: 'hello there' } } as Request
		const res = mockRes()
		const next = vi.fn() as NextFunction

		await textToSpeech(req, res, next)

		expect(next).toHaveBeenCalledWith(error)
		expect(res.status).not.toHaveBeenCalled()
		expect(res.send).not.toHaveBeenCalled()
	})
})
