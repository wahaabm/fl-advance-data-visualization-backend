import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import authRouter from './routes/authRoutes'
import adminRouter from './routes/ProtectedRoutes'
import userRouter from './routes/UserRoutes'
dotenv.config()

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(
  cors({
    origin: ['localhost', '64.23.225.23'],
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
)

const port = process.env.PORT || 3000

app.use('/status', (req, res) => {
  res.send('Server is running')
})

app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/', userRouter)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
