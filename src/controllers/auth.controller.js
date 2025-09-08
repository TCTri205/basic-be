// import { ObjectId } from 'mongodb'
import authService from '../services/auth.service.js'
import AuthService from '../services/auth.service.js'
import sendEmail from '../providers/email.provider.js'
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body
            const token = await AuthService.login(email, password)
            // if (!token) {
            //     return res.status(401).json({ message: 'Invalid credentials' })
            // }

            console.log('Generated token:', token)
            return res.status(200).json({
                success: 'true',
                token: token,
                message: 'Login successful',
            })
            // return res.status(200).json({ userId })
        } catch (error) {
            return res.status(500).json({ message: error.message })
            // next(error)
        }
    }

    async register(req, res) {
        try {
            const { email, password } = req.body
            const user = await AuthService.register(email, password)
            return res.status(201).json({ user })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    async getMe(req, res) {
        try {
            const userId = req.user
            const user = await authService.getMe(userId)
            return res.status(200).json({ user })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body
            const check = await authService.forgotPassword(email)

            if (!check) {
                return res.status(400).json({ message: 'Email not found' })
            }
            return res.status(200).json({ message: 'Check your email' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    async resetPassword(req, res) {
        try {
            const { email, token, newPassword } = req.body
            await authService.resetPassword(email, token, newPassword)
            return res
                .status(200)
                .json({ message: 'Reset password successfully' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

export default new AuthController()
