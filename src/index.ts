import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import { login } from "./controllers/AuthController";
import authRouter from "./routes/authRoutes";
import adminRouter from "./routes/ProtectedRoutes";
import userRouter from "./routes/UserRoutes";
dotenv.config();

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(
  cors({
    origin: ['http://localhost:5173', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

const port = process.env.PORT || 3000;

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/", userRouter);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
