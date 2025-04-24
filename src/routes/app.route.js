import { Router } from 'express'
import userRouter from './user.route.js'
import homeRoute from './home.route.js'
import { home } from '../controllers/home.controller.js'
import authRoute from './auth.route.js'

const router = Router()

router.use('/', homeRoute)
router.use('/users', userRouter)
router.use('/auth', authRoute) // Thêm route auth vào router chính

export default router
