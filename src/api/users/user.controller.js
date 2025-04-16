// import UserService from './user.service.js'

// class UserController {
//     // Get all users
//     getAll(req, res, next) {
//         UserService.readUsersFromFile((err, users) => {
//             if (err) return res.status(500).json({ message: err.error })
//             return res.json(users)
//         })
//     }

//     // Get a user
//     getUser(req, res, next) {
//         UserService.readUsersFromFile((err, users) => {
//             if (err) return res.status(500).json({ message: err.error })

//             const user = users.find((u) => u.id === Number(req.params.id))
//             if (!user) {
//                 return res.status(404).json({ message: 'User not found' })
//             }
//             return res.json(user)
//         })
//     }

//     // Create a new user
//     postUser(req, res, next) {
//         UserService.readUsersFromFile((err, users) => {
//             if (err) return res.status(500).json({ message: err.error })

//             const userId = users.length ? users[users.length - 1].id + 1 : 1
//             const newUser = { id: userId, name: req.body.name }
//             users.push(newUser)

//             UserService.writeUserToFile(users, (err) => {
//                 if (err) return res.status(500).json({ message: err.error })
//                 return res.status(201).json(users)
//             })
//         })
//     }

//     // Update a user
//     putUser(req, res, next) {
//         UserService.readUsersFromFile((err, users) => {
//             if (err) return res.status(500).json({ message: err.error })

//             const userId = Number(req.params.id)
//             const userIndex = users.findIndex((u) => u.id === userId)

//             if (userIndex === -1) {
//                 return res.status(404).json({ message: 'User not found' })
//             }

//             users[userIndex].name = req.body.name

//             UserService.writeUserToFile(users, (err) => {
//                 if (err) return res.status(500).json({ message: err.error })
//                 return res.json(users[userIndex])
//             })
//         })
//     }

//     // Delete a user
//     deleteUser(req, res, next) {
//         UserService.readUsersFromFile((err, users) => {
//             if (err) return res.status(500).json({ message: err.error })

//             const userId = Number(req.params.id)
//             const userIndex = users.findIndex((u) => u.id === userId)

//             if (userIndex === -1) {
//                 return res.status(404).json({ message: 'User not found' })
//             }

//             const deletedUser = users.splice(userIndex, 1)[0]

//             UserService.writeUserToFile(users, (err) => {
//                 if (err) return res.status(500).json({ message: err.error })
//                 return res.json(users)
//             })
//         })
//     }
// }

// export default new UserController()

import UserService from '../services/user.service.js'

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
            const data = req.body
            const updatedUser = await UserService.updateUser(userId, data)
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' })
            }
            return res.status(200).json(updatedUser)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    async deleteUser(req, res) {
        try {
            const userId = req.params.id
            const deletedUser = await UserService.deleteUser(userId)
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' })
            }
            return res.status(200).json(deletedUser)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}
export default new UserController()
