import AuthProvider from '../providers/auth.provider.js'
import UserModel from '../../models/user.model.js'

class AuthService {
    async login(email, password) {
        try {
            const user = await UserModel.getUserByEmailAndPassword(
                email,
                password
            )
            if (!user) {
                throw new Error('User not found!')
            }
            // console.log('user', user)
            const token = AuthProvider.encodeToken(user)
            return token // Trả về token
        } catch (error) {
            throw new Error('Error logging in: ' + error.message)
        }
    }

    async register(email, password) {
        try {
            const user = await UserModel.createUser({ email, password })
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
}

export default new AuthService()
