import express from 'express'
import payload from 'payload'
import cors from 'cors'
import { mediaManagement } from 'payload-cloudinary-plugin'
import path from 'path'

require('dotenv').config()
const app = express()
// expose assets directory as public
app.use('/assets', express.static(path.resolve(__dirname, '../assets')))

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true
  })
)
// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})
app.use(
  mediaManagement(
    {
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true
    },
    {
      folder: process.env.FOLDER
    }
  )
)
// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: process.env.MONGODB_URI,
  express: app,
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
  }
})

// Add your own express routes here

app.listen(process.env.PORT)
