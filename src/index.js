import express from 'express'
import path from 'path'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import router from './routes/app.route.js'
import errorHandler from './middleware/errorHandle.middleware.js'
import templateEngineConfig from './config/templateEngine.config.js'
import { connectDB } from './config/db.config.js'
import 'dotenv/config'

const startApp = () => {
    const app = express()
    const port = 3000

    app.use(express.json())
    // app.use('/abc', express.static(path.join(__dirname, 'public')))
    app.use('/', router)
    templateEngineConfig(app)
    app.use(errorHandler)

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

const runApp = async () => {
    try {
        await connectDB()
        console.log('1')
        console.log('Database connected successfully')
        startApp()
    } catch (error) {
        console.error('Error connecting to database:', error)
        process.exit(1)
    }
    console.log('Database connected successfully')
    // Uncomment the following line to connect to the database
}
runApp()
