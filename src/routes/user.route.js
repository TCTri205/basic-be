import { Router } from 'express'
import UserController from '../controllers/user.controller.js'

const route = Router()

// route.route('/').get(UserController.getAll).post(UserController.postUser)
// route.route('/hello')
//     .get(UserController.helloWord);
// route
//     .route('/:id')
//     .get(UserController.getUser)
//     .put(UserController.putUser)
//     .delete(UserController.deleteUser)

// route.route('/').get(UserController.getAllUsers)
route.route('/').post(UserController.createUser)
route.route('/:id').get(UserController.getUserById)
route.route('/:id').put(UserController.updateUser)
route.route('/:id').delete(UserController.deleteUser)
export default route
