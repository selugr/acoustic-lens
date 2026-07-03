import { Router } from 'express'
import { textToSpeech } from '../../controllers/text-to-speech.controller'

const router = Router()

router.post('/textToSpeech', textToSpeech)
// router.post('/getVoices', getVoices)

export default router
