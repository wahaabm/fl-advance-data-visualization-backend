import express from 'express'
import { getSettings } from '../controllers/SettingsController'
import {
  readArticle,
  showArticles,
  showCharts,
  showPinnedArticles,
} from '../controllers/UserController'
import checkToken from '../middlewares/checkToken'

const userRouter = express.Router()

userRouter.get('/pinned-articles', checkToken, showPinnedArticles)
userRouter.get('/articles', checkToken, showArticles)
userRouter.get('/article/:articleId', checkToken, readArticle)

userRouter.get('/charts', checkToken, showCharts)

userRouter.get('/settings', checkToken, getSettings)

export default userRouter
