import express from 'express'
import apiRoutes from './routes/index'
import { validateText } from './middleware'
import errorHandler from './middleware/errorHandler.middleware'

const app = express()

// TODO Cuota protection
// TODO Identify non related questions

app.use(express.json())
app.use(validateText)
app.use('/api', apiRoutes)
app.use(errorHandler)

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Server running on port: ${port}`)
})
