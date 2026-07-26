import { Router } from 'express'
import audioConfigController from '../../../controllers/audio-config/controller'
import { validateText } from '../../../middleware'

const router = Router()

router.post('/textToAudioProfile', validateText, audioConfigController.audioProfileFromTextController)

export default router
