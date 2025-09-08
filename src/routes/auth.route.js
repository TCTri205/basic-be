import express from 'express'
// import AuthService from '../services/auth.service.js'
import ValidateMiddleware from '../middleware/validate.middleware.js'
import AuthController from '../controllers/auth.controller.js'
import VerifyMiddleware from '../middleware/verify.middleware.js'

// console.log(AuthController)

const route = express.Router()

// route.get('/oke').get()
route
    .route('/register')
    .post(ValidateMiddleware.validateUser, AuthController.register)

route
    .route('/login')
    .post(ValidateMiddleware.validateUser, AuthController.login)

route.get('/getme', VerifyMiddleware.checkAuth, AuthController.getMe)

route.post('/forgot-password', AuthController.forgotPassword)
route.post('/reset-password', AuthController.resetPassword)

export default route
