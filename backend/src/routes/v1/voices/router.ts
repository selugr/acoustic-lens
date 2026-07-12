import { Router } from 'express';
import textToSpeech from '../../controllers/voices/controller';

const router = Router();

router.post('/textToSpeech', textToSpeech);
// router.post('/getVoices', getVoices); // keep for future

export default router;
