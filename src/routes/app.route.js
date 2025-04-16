import { Router } from 'express'
import userRouter from './user.route.js'
import homeRoute from './home.route.js'
import { home } from '../controllers/home.controller.js'

const router = Router()

router.use('/', homeRoute)
router.use('/users', userRouter)
// router.get('/home/:id', home) // Thêm route mới

export default router
