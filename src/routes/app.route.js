import { Router } from 'express'
import userRouter from './user.route.js'
import homeRoute from './home.route.js'
import { home } from '../controllers/home.controller.js'
import authRoute from './auth.route.js'
import uploadRoute from './upload.route.js'
import pollRoutes from './poll.route.js'

const router = Router()

router.use('/polls', pollRoutes)

router.use('/', homeRoute)
router.use('/users', userRouter)
router.use(
    '/auth',
    (req, res, next) => {
        console.log('2')
        next()
    },
    authRoute
) // Thêm route auth vào router chính

router.use('/upload', uploadRoute)

export default router
