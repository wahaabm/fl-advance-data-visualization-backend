import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import adminRouter from './routes/ProtectedRoutes';
import userRouter from './routes/UserRoutes';
import authRouter from './routes/authRoutes';
import path from 'path';

dotenv.config();

const app = express();

app.use(
  express.json({
    limit: '50mb',
  }),
);

app.use(compression());

// app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  cors({
    origin: [
      'http://localhost',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://64.23.225.23',
      'http://64.23.225.23:3000',
      'http://64.23.225.23:5173',
      'http://macrobourse.com',
      'http://macrobourse.com:3000',
      'http://macrobourse.com:5173',
      'http://www.macrobourse.com',
      'http://www.macrobourse.com:3000',
      'http://www.macrobourse.com:5173',
      'https://macrobourse.com',
      'https://macrobourse.com:3000',
      'https://macrobourse.com:5173',
      'https://www.macrobourse.com',
      'https://www.macrobourse.com:3000',
      'https://www.macrobourse.com:5173',
    ],
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

const port = parseInt(process.env.PORT || '3000');

app.use('/status', (req, res) => {
  res.send('Server is running');
});

app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/', userRouter);

app.listen(port, '0.0.0.0', () => {
  console.log(`[server]: Server is running at ${port}`);
});
