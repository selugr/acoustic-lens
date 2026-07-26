import type { NextFunction, Request, Response } from 'express'
import { audioConfigService } from '../../../services/audio-config/service'

export default async function audioProfileFromTextController(req: Request, res: Response, next: NextFunction) {
	try {
		const { text } = req.body

		const audioProfile = await audioConfigService.composeAudioProfileFromText(text)

		res.status(200).json(audioProfile)
	} catch (error) {
		next(error) // Pasa al errorHandler
	}
}
