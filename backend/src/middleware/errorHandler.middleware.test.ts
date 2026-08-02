import type { Request, Response } from 'express'
import { afterEach, describe, expect, it, vi } from 'vitest'
import errorHandler from './errorHandler.middleware'

function mockRes() {
	const res: Partial<Response> = {}
	res.status = vi.fn().mockReturnValue(res)
	res.json = vi.fn().mockReturnValue(res)
	return res as Response
}

describe('errorHandler', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('responds 500 with the error message', () => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined)
		const res = mockRes()
		const next = vi.fn()

		errorHandler(new Error('boom'), {} as Request, res, next)

		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.json).toHaveBeenCalledWith({ error: 'boom' })
		expect(next).not.toHaveBeenCalled()
	})

	it('falls back to a generic message when err.message is empty', () => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined)
		const res = mockRes()

		errorHandler(new Error(''), {} as Request, res, vi.fn())

		expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
	})

	it('falls back to a generic message when the error has no message property', () => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined)
		const res = mockRes()

		errorHandler({} as Error, {} as Request, res, vi.fn())

		expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
	})

	it('logs the error via console.error', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
		const err = new Error('logged')

		errorHandler(err, {} as Request, mockRes(), vi.fn())

		expect(spy).toHaveBeenCalledWith(err)
	})
})
