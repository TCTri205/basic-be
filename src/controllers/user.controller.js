import UserService from '../services/user.service.js'
import { ObjectId } from 'mongodb'

class UserController {
    async createUser(req, res) {
        try {
            const { email, password } = req.body
            const userId = await UserService.createUser(email, password)
            return res.status(201).json({ userId })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers()
            return res.status(200).json(users)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    async getUserById(req, res) {
        try {
            const userId = req.params.id
            if (!ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Invalid user ID' })
            }
            const user = await UserService.getUserById(userId)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            return res.status(200).json(user)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    async updateUser(req, res) {
        try {
            const userId = req.params.id
            if (!ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Invalid user ID' })
            }
            const data = req.body
            const updatedUser = await UserService.updateUser(userId, data)
            if (!updatedUser.matchedCount) {
                return res.status(404).json({ message: 'User not found' })
            }
            return res
                .status(200)
                .json({ message: 'User updated successfully' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    async deleteUser(req, res) {
        try {
            const userId = req.params.id
            if (!ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Invalid user ID' })
            }
            const deletedUser = await UserService.deleteUser(userId)
            if (!deletedUser.deletedCount) {
                return res.status(404).json({ message: 'User not found' })
            }
            return res
                .status(200)
                .json({ message: 'User deleted successfully' })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

export default new UserController()
