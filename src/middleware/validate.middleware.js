import Joi from 'joi'

class ValidateMiddleware {
    // Validate ObjectId
    async validateId(req, res, next) {
        try {
            const schema = Joi.object({
                id: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(), // Validate ObjectId của MongoDB
            })

            await schema.validateAsync(req.params, { abortEarly: false })
            next()
        } catch (err) {
            res.status(400).json({
                success: false,
                message: 'Invalid ID format',
                details: err.details.map((detail) => detail.message), // Trả về chi tiết lỗi
            })
        }
    }

    // // Validate email và name
    // async validateUser(req, res, next) {
    //     try {
    //         const schema = Joi.object({
    //             email: Joi.string().email().required().messages({
    //                 'string.email': 'Invalid email format',
    //                 'any.required': 'Email is required',
    //             }),
    //             name: Joi.string().min(3).max(50).required().messages({
    //                 'string.min': 'Name must be at least 3 characters',
    //                 'string.max': 'Name must not exceed 50 characters',
    //                 'any.required': 'Name is required',
    //             }),
    //         })

    //         await schema.validateAsync(req.body, { abortEarly: false })
    //         next()
    //     } catch (err) {
    //         res.status(400).json({
    //             success: false,
    //             message: 'Validation error',
    //             details: err.details.map((detail) => detail.message), // Trả về chi tiết lỗi
    //         })
    //     }
    // }
    async validateUser(req, res, next) {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required().messages({
                    'string.email': 'Invalid email format',
                    'any.required': 'Email is required',
                }),
                password: Joi.string().min(6).max(50).required().messages({
                    'string.min': 'Password must be at least 6 characters',
                    'string.max': 'Password must not exceed 50 characters',
                    'any.required': 'Password is required',
                }),
            })
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (err) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                details: err.details.map((detail) => detail.message), // Trả về chi tiết lỗi
            })
        }
    }
}

export default new ValidateMiddleware()
