import express from 'express'
import { home, home_id } from '../controllers/home.controller.js'

const router = express.Router()

router.get('/', home)
router.get('/:id', home_id)

export default router
