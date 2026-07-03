import express from 'express'
import apiRoutes from './routes/index.js'

const app = express()

// TODO Cuota protection
// TODO Identify non related questions

app.use(express.json())
app.use('/api', apiRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Server running on port: ${port}`)
})
