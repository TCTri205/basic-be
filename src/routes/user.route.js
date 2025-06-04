import { Router } from 'express'
import ValidateMiddleware from '../middleware/validate.middleware.js'
import UserController from '../controllers/user.controller.js'

const route = Router()
// route.get('/oke', (req, res, next) => {
//     res.send('oke')
// })

route.route('/all').get(UserController.getAllUsers)

route
    .route('/')
    // .get(UserController.getAllUsers)
    .post(ValidateMiddleware.validateUser, UserController.createUser)

route
    .route('/:id')
    .get(ValidateMiddleware.validateId, UserController.getUserById)
    .put(
        ValidateMiddleware.validateId,
        ValidateMiddleware.validateUser,
        UserController.updateUser
    )
    .delete(ValidateMiddleware.validateId, UserController.deleteUser)

export default route
