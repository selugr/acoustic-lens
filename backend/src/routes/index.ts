import { Router } from 'express'
import audioConfigRoutes from './v1/audio-config/router'
import voicesRoutes from './v1/voices/router'

// import userRoutes from './v1/user.route'; // Example of another route
const router = Router()
// Define your API versioning/mounting here
router.use('/audio-config', audioConfigRoutes)
router.use('/voices', voicesRoutes)
// router.use('/users', userRoutes);
export default router
