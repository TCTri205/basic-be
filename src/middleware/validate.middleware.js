import Joi from 'joi'
class ValidateMiddleware {
    async validateId(request, response, next) {
        try {
            const schema = Joi.object({
                if: Joi.number().required(),
            })

            await schema.validateAsync(req.params, { abortEarly: false })
            next()
        } catch (err) {
            res.status(404).json({
                success: false,
                message: 'Invalid ID',
            })
        }
    }
}
export default new ValidateMiddleware()
