import express from 'express'
import multer from 'multer'
import {
  allowUser,
  makeEditor,
  removeEditor,
  revokeUser,
  showEditors,
  showUsers,
} from '../controllers/AdminController'
import {
  addArticle,
  deleteArticle,
  editArticle,
} from '../controllers/ArticleController'
import {
  addChartData,
  deleteChart,
  uploadChartCSV,
} from '../controllers/ChartController'
import checkToken from '../middlewares/checkToken'

const protectedRouter = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

protectedRouter.get('/users', checkToken, showUsers)
protectedRouter.post('/allowUser/:userId', checkToken, allowUser)
protectedRouter.post('/revokeUser/:userId', checkToken, revokeUser)
protectedRouter.post('/removeEditor/:userId', checkToken, removeEditor)
protectedRouter.post('/makeEditor/:userId', checkToken, makeEditor)
protectedRouter.get('/editors', checkToken, showEditors)

protectedRouter.post('/article', checkToken, addArticle)
protectedRouter.delete('/article/:articleId', checkToken, deleteArticle)
protectedRouter.put('/article/:articleId', checkToken, editArticle)

protectedRouter.post(
  '/csv',
  upload.single('csvFile'),
  checkToken,
  uploadChartCSV
)
protectedRouter.delete('/chart/:chartId', checkToken, deleteChart)
protectedRouter.put('/chart/:chartId', checkToken, addChartData)

export default protectedRouter
