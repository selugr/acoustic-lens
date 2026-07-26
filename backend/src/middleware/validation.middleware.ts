import type { NextFunction, Request, Response } from 'express'

export default function validateText(req: Request, res: Response, next: NextFunction) {
	const { text } = req.body
	if (!text || typeof text !== 'string' || text.trim().length < 3) {
		return res.status(400).json({ error: 'Text must be at least 3 characters' })
	}
	next()
}
