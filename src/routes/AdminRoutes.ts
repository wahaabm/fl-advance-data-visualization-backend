import express from 'express';
import { login, register } from '../controllers/AuthController';
import checkToken from '../middlewares/checkToken';
import { app } from '../controllers/AdminController';

const appRouter = express.Router();

appRouter.get("/check",checkToken,app);

export default appRouter;
