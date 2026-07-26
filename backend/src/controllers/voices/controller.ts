import type { NextFunction, Request, Response } from 'express'
import { voicesService } from '../../services/voices/service'

export default async function textToSpeech(req: Request, res: Response, next: NextFunction) {
	try {
		const { text } = req.body

		const speech = await voicesService.speechFromText(text)

		res.setHeader('Content-Type', 'audio/mpeg')
		res.setHeader('Content-Length', speech.length)
		res.status(200).send(speech)
	} catch (error) {
		next(error)
	}
}
