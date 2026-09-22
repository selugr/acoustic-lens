import express from 'express'
import { errorHandler } from './middleware'
import apiRoutes from './routes/index'

export function createApp() {
	const app = express()

	app.use(express.json())
	app.use('/api', apiRoutes)
	app.use(errorHandler)

	return app
}
