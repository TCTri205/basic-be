import AuthProvider from '../providers/auth.provider.js'
import UserModel from '../../models/user.model.js'
import hashProvider from '../providers/hash.provider.js'
import sendEmail from '../providers/email.provider.js'

class AuthService {
    async login(email, password) {
        try {
            const user = await UserModel.getUserByEmail(email)
            const hashString = await UserModel.getPassByEmail(email)

            if (!hashString) {
                throw new Error('User not found!')
            }

            // const passDB = await hashProvider.generateHash(password)

            // console.log(
            //     'plaintext:',
            //     typeof password,
            //     password,
            //     'hashed:   ',
            //     typeof user.password,
            //     user.password
            // )
            // const check = await hashProvider.compareHash(passDB, hashString)
            const check = await hashProvider.compareHash(password, hashString)

            if (!check) {
                throw new Error('Email hoặc mật khẩu không đúng')
            }

            // console.log('user', user)
            const token = await AuthProvider.encodeToken(user)
            return token // Trả về token
        } catch (error) {
            throw new Error('Error logging in: ' + error.message)
        }
    }

    async register(email, password) {
        try {
            // console.log(1)
            const hashString = await hashProvider.generateHash(password)
            console.log(hashString)
            const user = await UserModel.createUser({
                email: email,
                password: hashString,
            })
            // console.log(hashString)
            return user // Trả về user bao gồm _id, email, và password
        } catch (error) {
            throw new Error('Error creating user: ' + error.message)
        }
    }

    async getMe(userId) {
        try {
            const user = await UserModel.getUserById(userId)
            if (!user) {
                throw new Error('User not found')
            }
            const data = {
                id: user._id,
                email: user.email,
            }
            return data
        } catch (error) {
            throw new Error('Error fetching user: ' + error.message)
        }
    }

    async forgotPassword(email) {
        try {
            const user = await UserModel.getUserByEmail(email)
            if (!user) {
                throw new Error('User not found')
            }

            // Tạo token reset password
            const rawToken = await hashProvider.generateRandomToken()
            console.log('rawToken', rawToken)
            // const token = await hashProvider.generateHash(rawToken)

            // Gửi email reset password
            // console.log('token', token)
            await sendEmail({
                from: email,
                to: process.env.SMTP_USER,
                subject: 'Forgot Password',
                text: rawToken,
            })
            console.log('Email sent to:', process.env.SMTP_USER)

            // Cập nhật token vào cơ sở dữ liệu
            await UserModel.updateUserToken(email, rawToken)

            return true
        } catch (error) {
            throw new Error('Error sending email: ' + error.message)
        }
    }
    async resetPassword(email, token, newPassword) {
        try {
            // const user = await UserModel.getUserByEmailAndToken(email, token)
            const user = await UserModel.getUserByEmail(email)
            if (!user) {
                throw new Error('User not found')
            }
            if (user.resetPasswordExpires < Date.now()) {
                throw new Error('Token expired')
            }
            if (!user.resetPasswordToken || user.resetPasswordToken !== token) {
                throw new Error('Invalid token')
            }
            const hashString = await hashProvider.generateHash(newPassword)
            await UserModel.updatePassword(email, hashString)
            return true
        } catch (error) {
            throw new Error('Error resetting password: ' + error.message)
        }
    }
}

export default new AuthService()
