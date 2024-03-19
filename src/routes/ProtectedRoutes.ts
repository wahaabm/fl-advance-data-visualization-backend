import express from "express";
import { login, register } from "../controllers/AuthController";
import checkToken from "../middlewares/checkToken";
import {
  allowUser,
  makeEditor,
  removeEditor,
  revokeUser,
  showUsers,
} from "../controllers/AdminController";
import {
  addArticle,
  deleteArticle,
  editArticle,
} from "../controllers/ArticleController";
import { uploadChartCSV, deleteChart } from "../controllers/ChartController";

import multer from "multer";

const protectedRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

protectedRouter.get("/showUsers", checkToken, showUsers);
protectedRouter.get("/allowUser/:userId", checkToken, allowUser);
protectedRouter.get("/revokeUser/:userId", checkToken, revokeUser);
protectedRouter.get("/removeEditor/:userId", checkToken, removeEditor);
protectedRouter.get("/makeEditor/:userId", checkToken, makeEditor);

protectedRouter.post("/addArticle/:userId", checkToken, addArticle);
protectedRouter.delete("/deleteArticle/:articleId", checkToken, deleteArticle);
protectedRouter.put("/editArticle/:articleId", checkToken, editArticle);

protectedRouter.post(
  "/uploadCSV/:userId",
  upload.single("csvFile"),
  checkToken,
  uploadChartCSV
);
protectedRouter.delete("/deleteChart/:chartId", checkToken, deleteChart);
export default protectedRouter;
