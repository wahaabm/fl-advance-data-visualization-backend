import express from "express";
import { login, register } from "../controllers/AuthController";
import checkToken from "../middlewares/checkToken";
import {
  allowUser,
   makeEditor,
  removeEditor,
  revokeUser,
  showUsers,
  addArticle,
  deleteArticle
} from "../controllers/AdminController";

const adminRouter = express.Router();

adminRouter.get("/showUsers", checkToken, showUsers);
 adminRouter.get("/allowUser/:userId", checkToken, allowUser);
adminRouter.get("/revokeUser/:userId", checkToken, revokeUser);
adminRouter.get("/removeEditor/:userId", checkToken, removeEditor);
 adminRouter.get("/makeEditor/:userId", checkToken, makeEditor);
 adminRouter.post("/addArticle/:userId", checkToken, addArticle);
 adminRouter.get("/deleteArticle/:articleId", checkToken, deleteArticle);

export default adminRouter;
