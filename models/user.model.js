import { getDB } from '../src/config/db.config.js'
import { ObjectId } from 'mongodb'

class UserModel {
    // Tạo một user mới
    static async createUser(data) {
        try {
            const result = await getDB().collection('users').insertOne(data)
            return { _id: result.insertedId, ...data }
        } catch (error) {
            throw new Error('Error creating user: ' + error.message)
        }
    }

    // Lấy tất cả users
    static async getAllUsers() {
        try {
            const users = await getDB().collection('users').find().toArray()
            return users
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message)
        }
    }

    // Lấy user theo ID
    static async getUserById(id) {
        try {
            const user = await getDB()
                .collection('users')
                .findOne({ _id: new ObjectId(id) })
            return user
        } catch (error) {
            throw new Error('Error fetching user: ' + error.message)
        }
    }

    // Cập nhật user theo ID
    static async updateUser(id, data) {
        try {
            const result = await getDB()
                .collection('users')
                .updateOne({ _id: new ObjectId(id) }, { $set: data })
            return result
        } catch (error) {
            throw new Error('Error updating user: ' + error.message)
        }
    }

    // Xóa user theo ID
    static async deleteUser(id) {
        try {
            const result = await getDB()
                .collection('users')
                .deleteOne({ _id: new ObjectId(id) })
            return result
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message)
        }
    }

    static async getUserByEmailAndPassword(email, password) {
        // try {
        //     const user = await getDB()
        //         .collection('users')
        //         .findOne({ email, password })
        //     return user
        // } catch (error) {
        //     throw new Error('Error fetching user: ' + error.message)
        // }
        const user = await getDB()
            .collection('users')
            .findOne({ email, password })
        if (!user) {
            throw new Error('Invalid credentials')
        }
        return user
    }

    static async getUserByEmail(email) {
        // try {
        //     const user = await getDB()
        //         .collection('users')
        //         .findOne({ email, password })
        //     return user
        // } catch (error) {
        //     throw new Error('Error fetching user: ' + error.message)
        // }
        const user = await getDB().collection('users').findOne({ email })
        if (!user) {
            throw new Error('Invalid credentials')
        }
        return user
    }

    static async getPassByEmail(email) {
        try {
            const user = await getDB()
                .collection('users')
                .findOne({ email }, { projection: { password: 1 } }) // Chỉ lấy trường password
            if (!user) {
                throw new Error('User not found')
            }
            return user.password // Trả về mật khẩu
        } catch (error) {
            throw new Error(
                'Error fetching password by email: ' + error.message
            )
        }
    }
}

export default UserModel
