import type { NextFunction, Request, Response } from 'express';
import { voicesService } from '../../services/voices/service';

export default async function textToSpeech(req: Request, res: Response, next: NextFunction) {
  try {
    const { text } = req.body;

    if (!text || text.length < 3) {
      return res.status(400).json({ error: 'Text must be at least 3 characters' });
    }

    const speech = await voicesService.speechFromText(text);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', speech.length);
    res.status(200).send(speech);
  } catch (error) {
    next(error);
  }
}
