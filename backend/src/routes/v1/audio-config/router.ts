import { Router } from 'express';
import audioConfigController from '../../controllers/audio-config/controller';

const router = Router();

router.post('/textToAudioProfile', audioConfigController.audioProfileFromTextController);

export default router;
