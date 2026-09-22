import { createApp } from './app.mts'

// TODO Cuota protection
// TODO Identify non related questions

const app = createApp()

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log(`Server running on port: ${port}`)
})
