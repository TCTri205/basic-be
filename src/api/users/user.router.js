import express from "express";
import UserController from "./user.controller.js"; 
const route = express.Router();

route.route('/')
    .get(UserController.getAll)
    .post(UserController.postUser);

route.route('/:id')
    .get(UserController.getUser)
    .put(UserController.putUser)
    .delete(UserController.deleteUser);

export default route;