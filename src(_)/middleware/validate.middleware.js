import Joi from 'joi'

class ValidateMiddleware {
    async validateId(req, res, next) {
        try {
            const schema = Joi.object({
                id: Joi.number().integer().min(1).required(),
            })
            const { error } = schema.validate(req.params)
            if (error) {
                return res.status(400).json({ error: error.details[0].message })
            }
            next()
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

export default new ValidateMiddleware()
