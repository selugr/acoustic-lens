import type { NextFunction, Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { audioConfigService } from '../../../services/audio-config/service'
import audioProfileFromTextController from './index'

vi.mock('../../../services/audio-config/service', () => ({
	audioConfigService: {
		composeAudioProfileFromText: vi.fn(),
	},
}))

function mockRes() {
	const res: Partial<Response> = {}
	res.status = vi.fn().mockReturnValue(res)
	res.json = vi.fn().mockReturnValue(res)
	return res as Response
}

describe('audioProfileFromTextController', () => {
	beforeEach(() => {
		vi.mocked(audioConfigService.composeAudioProfileFromText).mockReset()
	})

	it('returns 200 with the composed profile on success', async () => {
		const profile = { spatial_config: {}, acoustic_space: {}, audio_processing: {} }
		vi.mocked(audioConfigService.composeAudioProfileFromText).mockResolvedValue(profile as never)

		const req = { body: { text: 'a cathedral far away' } } as Request
		const res = mockRes()
		const next = vi.fn() as NextFunction

		await audioProfileFromTextController(req, res, next)

		expect(audioConfigService.composeAudioProfileFromText).toHaveBeenCalledWith('a cathedral far away')
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith(profile)
		expect(next).not.toHaveBeenCalled()
	})

	it('forwards a service rejection to next(error) without sending a response', async () => {
		const error = new Error('groq failure')
		vi.mocked(audioConfigService.composeAudioProfileFromText).mockRejectedValue(error)

		const req = { body: { text: 'a cathedral far away' } } as Request
		const res = mockRes()
		const next = vi.fn() as NextFunction

		await audioProfileFromTextController(req, res, next)

		expect(next).toHaveBeenCalledWith(error)
		expect(res.status).not.toHaveBeenCalled()
		expect(res.json).not.toHaveBeenCalled()
	})
})
