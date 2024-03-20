import express from "express";
import { showArticles, showCharts } from "../controllers/UserController";
import checkToken from "../middlewares/checkToken";

const userRouter = express.Router();

userRouter.get("/articles", checkToken, showArticles);
userRouter.get("/charts", checkToken, showCharts);
export default userRouter;
