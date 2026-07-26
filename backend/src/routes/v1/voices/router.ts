import { Router } from 'express'
import textToSpeech from '../../../controllers/voices/controller'
import { validateText } from '../../../middleware'

const router = Router()

router.post('/textToSpeech', validateText, textToSpeech)
// router.post('/getVoices', getVoices); // keep for future

export default router
