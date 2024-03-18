import express from 'express';
import { login, register } from '../controllers/loginController';
import checkToken from '../middlewares/checkToken';
import { app } from '../controllers/appController';

const appRouter = express.Router();

appRouter.get("/check",checkToken,app);
export default appRouter;
