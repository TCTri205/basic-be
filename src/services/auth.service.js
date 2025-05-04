import AuthProvider from '../providers/auth.provider.js'
import UserModel from '../../models/user.model.js'
import hashProvider from '../providers/hash.provider.js'

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
}

export default new AuthService()
