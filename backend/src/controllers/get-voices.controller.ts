// import { validateTextInput } from '../middlewares/validation.middleware' // Opcional
import type { NextFunction, Request, Response } from 'express'
import { audioConfigService } from '../services/audio-config/audio-config.service'

export const textToSpeech = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { text } = req.body

		// Validación básica (podría estar en un middleware)
		if (!text || text.length < 3) {
			return res.status(400).json({ error: 'Text must be at least 3 characters' })
		}

		// Llamada al Service (NO se menciona Groq aquí)
		const audioProfile = await audioConfigService.composeAudioProfileFromText(text)

		// Devuelve el JSON que el navegador usará para la Web Audio API
		res.status(200).json({
			success: true,
			config: audioProfile, // Ej: { pitch: 1.2, rate: 0.9, voice: 'en-US-Standard-A' }
		})
	} catch (error) {
		next(error) // Pasa al errorHandler
	}
}
