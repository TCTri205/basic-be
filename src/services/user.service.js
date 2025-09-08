import UserModel from '../../models/user.model.js'

class UserService {
    async createUser(email, password) {
        try {
            const user = await UserModel.createUser({ email, password })
            return user // Trả về user bao gồm _id, email, và password
        } catch (error) {
            throw new Error('Error creating user: ' + error.message)
        }
    }

    async getAllUsers() {
        try {
            const users = await UserModel.getAllUsers()
            return users
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message)
        }
    }

    async getUserById(id) {
        try {
            const user = await UserModel.getUserById(id)
            if (!user) {
                throw new Error('User not found')
            }
            return user
        } catch (error) {
            throw new Error('Error fetching user: ' + error.message)
        }
    }

    async updateUser(id, data) {
        try {
            const updatedUser = await UserModel.updateUser(id, data)
            if (!updatedUser.matchedCount) {
                throw new Error('User not found')
            }
            return { message: 'User updated successfully' }
        } catch (error) {
            throw new Error('Error updating user: ' + error.message)
        }
    }

    async deleteUser(id) {
        try {
            const deletedUser = await UserModel.deleteUser(id)
            if (!deletedUser.deletedCount) {
                throw new Error('User not found')
            }
            return { message: 'User deleted successfully' }
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message)
        }
    }
}

export default new UserService()
