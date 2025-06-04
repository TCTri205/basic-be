import { Router } from 'express'

// const router = Router()

// router.use((err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).json({ message: 'Internal server error' })
// })

const errorHandler = (err, req, res, next) => {
    if (!err.statusCode) {
        err.statusCode = 500
    }

    const resError = {
        statusCode: err.statusCode,
        message: err.message || 'Internal server error',
        stack: err.stack,
    }

    console.error('🔥 CATCHED BY errorHandler:', err)
    res.status(err.statusCode).json(resError)
}

export default errorHandler
