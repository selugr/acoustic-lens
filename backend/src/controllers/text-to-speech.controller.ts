// import { validateTextInput } from '../middlewares/validation.middleware' // Opcional
import type { NextFunction, Request, Response } from 'express'
import { voicesService } from '../services/voices/voices.service'

export const textToSpeech = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { text } = req.body

		// Validación básica (podría estar en un middleware)
		if (!text || text.length < 3) {
			return res.status(400).json({ error: 'Text must be at least 3 characters' })
		}

		// Llamada al Service (NO se menciona Groq aquí)
		const speech = await voicesService.speechFromText(text)

		res.setHeader('Content-Type', 'audio/mpeg') // Indica que es un MP3
		res.setHeader('Content-Length', speech.length)

		// Devuelve el JSON que el navegador usará para la Web Audio API
		res.status(200).send(speech)

		// 2. Convertir el Web Stream a Node Stream y PIPE a la respuesta
		//    El método .pipe() de Express (res) funciona con Node Streams.
		// const nodeStream = Readable.fromWeb(webStream);
		// nodeStream.pipe(res);

		// // 3. Manejar errores en el flujo
		// nodeStream.on('error', (err) => {
		//     console.error('Error en el stream:', err);
		//     if (!res.headersSent) {
		//         res.status(500).send('Error al transmitir el audio');
		//     } else {
		//         res.end();
		//     }
		// });
	} catch (error) {
		next(error) // Pasa al errorHandler
	}
}
