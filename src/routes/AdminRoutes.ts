import express from "express";
import { login, register } from "../controllers/AuthController";
import checkToken from "../middlewares/checkToken";
import { allowUser, app, showUsers } from "../controllers/AdminController";

const adminRouter = express.Router();

adminRouter.get("/check", checkToken, app);
adminRouter.get("/showUsers", checkToken, showUsers);
adminRouter.get("/allowUser/:userId", checkToken, allowUser);
adminRouter.get("/revokeAccess", checkToken, allowUser);

export default adminRouter;
