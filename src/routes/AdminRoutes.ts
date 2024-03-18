import express from "express";
import { login, register } from "../controllers/AuthController";
import checkToken from "../middlewares/checkToken";
import {
  allowUser,
  app,
  makeEditor,
  removeEditor,
  revokeUser,
  showUsers,
} from "../controllers/AdminController";

const adminRouter = express.Router();

adminRouter.get("/check", checkToken, app);
adminRouter.get("/showUsers", checkToken, showUsers);
adminRouter.get("/allowUser/:userId", checkToken, allowUser);
adminRouter.get("/revokeUser/:userId", checkToken, revokeUser);
adminRouter.get("/removeEditor/:userId", checkToken, removeEditor);
adminRouter.get("/makeEditor/:userId", checkToken, makeEditor);

export default adminRouter;
