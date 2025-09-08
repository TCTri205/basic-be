import jwt from 'jsonwebtoken'
import 'dotenv/config'

class AuthProvider {
    async encodeToken(user) {
        try {
            const payload = { id: user._id, email: user.email }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION,
                algorithm: 'HS256',
            })
            return token
        } catch (error) {
            throw new Error('Error encoding token: ' + error.message)
        }
    }

    async decodeToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            return decoded
        } catch (error) {
            throw new Error('Error decoding token: ' + error.message)
        }
    }
}

export default new AuthProvider()
