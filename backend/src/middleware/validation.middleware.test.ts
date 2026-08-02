import type { NextFunction, Request, Response } from 'express'
import { describe, expect, it, vi } from 'vitest'
import validateText from './validation.middleware'

function mockRes() {
	const res: Partial<Response> = {}
	res.status = vi.fn().mockReturnValue(res)
	res.json = vi.fn().mockReturnValue(res)
	return res as Response
}

function run(body: unknown) {
	const req = { body } as Request
	const res = mockRes()
	const next = vi.fn() as NextFunction
	validateText(req, res, next)
	return { res, next }
}

describe('validateText', () => {
	it('rejects a missing text field', () => {
		const { res, next } = run({})
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ error: 'Text must be at least 3 characters' })
		expect(next).not.toHaveBeenCalled()
	})

	it('rejects null and undefined text', () => {
		expect(run({ text: null }).next).not.toHaveBeenCalled()
		expect(run({ text: undefined }).next).not.toHaveBeenCalled()
	})

	it('rejects a non-string text (number)', () => {
		const { res, next } = run({ text: 123 })
		expect(res.status).toHaveBeenCalledWith(400)
		expect(next).not.toHaveBeenCalled()
	})

	it('rejects an empty string', () => {
		const { res, next } = run({ text: '' })
		expect(res.status).toHaveBeenCalledWith(400)
		expect(next).not.toHaveBeenCalled()
	})

	it('rejects a string shorter than 3 characters', () => {
		const { res, next } = run({ text: 'ab' })
		expect(res.status).toHaveBeenCalledWith(400)
		expect(next).not.toHaveBeenCalled()
	})

	it('rejects whitespace-only text even at length >= 3', () => {
		const { res, next } = run({ text: '   ' })
		expect(res.status).toHaveBeenCalledWith(400)
		expect(next).not.toHaveBeenCalled()
	})

	it('accepts text at the exact 3-character boundary', () => {
		const { res, next } = run({ text: 'abc' })
		expect(next).toHaveBeenCalledOnce()
		expect(res.status).not.toHaveBeenCalled()
	})

	it('accepts a valid, longer string and calls next()', () => {
		const { res, next } = run({ text: 'a valid piece of text' })
		expect(next).toHaveBeenCalledOnce()
		expect(res.status).not.toHaveBeenCalled()
	})
})
