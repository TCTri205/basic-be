// import express from 'express'
// import * as pollController from '../controllers/poll.controller.js'

// const router = express.Router()

// router.get('/', pollController.getAllPolls)
// router.post('/', pollController.createPoll)
// router.get('/:id', pollController.getPollById)
// router.post('/:id/vote', pollController.vote)
// router.delete('/:id/unvote', pollController.unvote)

// export default router

import express from 'express'
import * as pollController from '../controllers/poll.controller.js'
import VerifyMiddleware from '../middleware/verify.middleware.js'

const router = express.Router()

// Public endpoint: lấy danh sách poll
router.get('/', pollController.getAllPolls)

// Private endpoint: tạo poll (nếu bạn muốn chỉ user đã login mới tạo được)
router.post('/', VerifyMiddleware.checkAuth, pollController.createPoll)

// Lấy poll chi tiết (có thể public hoặc private tuỳ ý)
router.get('/:id', pollController.getPollById)

// Vote: MUST be logged-in → gắn middleware checkAuth
router.post('/:id/vote', VerifyMiddleware.checkAuth, pollController.vote)

// Unvote: cũng cần login
router.delete('/:id/unvote', VerifyMiddleware.checkAuth, pollController.unvote)

export default router
