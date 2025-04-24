import authProvider from '../providers/auth.provider.js'
import AuthService from '../services/auth.service.js'

class VerifyMiddleware {
    async checkAuth(req, res, next) {
        try {
            const header = req.headers['authorization']
            if (!header) {
                // return res.status(401).json({ message: 'Unauthorized' })
                throw new Error('Not login yet')
            }

            const token = header.split(' ')[1]
            const data = await authProvider.decodeToken(token)
            req.user = data.id
            next()
        } catch (error) {
            // return res.status(403).json({ message: 'Forbidden' })
            next(error)
        }
    }
}
export default new VerifyMiddleware()
