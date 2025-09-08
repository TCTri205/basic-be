import { getDB } from '../src/config/db.config.js'
import { ObjectId } from 'mongodb'
import hashProvider from '../src/providers/hash.provider.js'

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

    static async updatePassword(email, newPassword) {
        try {
            const result = await getDB()
                .collection('users')
                .updateOne(
                    { email },
                    {
                        $set: {
                            password: newPassword,
                            resetPasswordExpires: null,
                            resetPasswordToken: null,
                        },
                    }
                )
            return result
        } catch (error) {
            throw new Error('Error updating password: ' + error.message)
        }
    }

    static async getUserByEmailAndToken(email, token) {
        try {
            const user = await getDB()
                .collection('users')
                .findOne({ email, token })
            return user
        } catch (error) {
            throw new Error('Error fetching user: ' + error.message)
        }
    }

    static async updateUserToken(email, token) {
        try {
            const result = await getDB()
                .collection('users')
                .updateOne(
                    { email },
                    {
                        $set: {
                            resetPasswordToken: token,
                            resetPasswordExpires: Date.now() + 15 * 60 * 1000,
                        },
                    }
                )
            return result
        } catch (error) {
            throw new Error('Error updating user token: ' + error.message)
        }
    }

    // static async forgotPassword(email) {
    //     try {
    //         const user = await getDB()
    //             .collection('users')
    //             .find({ email })
    //             .project({
    //                 email: 1,
    //                 resetPasswordToken: 1,
    //                 resetPasswordExpires: 1,
    //             })
    //         return user
    //     } catch (error) {
    //         throw new Error('Error fetching user: ' + error.message)
    //     }
    // }

    // static async forgotPassword(email) {
    //     try {
    //         const db = await getDB()
    //         const user = await db.collection('users').findOne({ email })

    //         if (!user) {
    //             throw new Error(
    //                 'Không tìm thấy người dùng với email đã cung cấp'
    //             )
    //         }

    //         // 1. Tạo token raw
    //         const hashedToken = hashProvider.generateRandomToken()

    //         // 2. Băm token
    //         // const hashedToken = await hashProvider.generateHash(rawToken, 10)

    //         // 3. Xác định thời gian hết hạn (15 phút)
    //         const expires = Date.now() + 15 * 60 * 1000

    //         // 4. Cập nhật vào DB
    //         await db.collection('users').updateOne(
    //             { email },
    //             {
    //                 $set: {
    //                     resetPasswordToken: hashedToken,
    //                     resetPasswordExpires: new Date(expires),
    //                 },
    //             }
    //         )

    //         // 5. Trả về rawToken để gửi email
    //         return hashedToken
    //     } catch (error) {
    //         throw new Error(
    //             'Lỗi khi tạo token đặt lại mật khẩu: ' + error.message
    //         )
    //     }
    // }

    // static async resetPassword(email, token, newPassword) {
    //     try {
    //         const result = await getDB()
    //             .collection('users')
    //             .updateOne(
    //                 { email, token },
    //                 { $set: { password: newPassword } }
    //             )
    //         return result
    //     } catch (error) {
    //         throw new Error('Error resetting password: ' + error.message)
    //     }
    // }

    static async resetPassword(email, token, newPassword) {
        try {
            const db = await getDB()
            const user = await db.collection('users').findOne({ email })

            if (!user) {
                throw new Error('Không tìm thấy người dùng')
            }

            if (!user.resetPasswordToken || !user.resetPasswordExpires) {
                throw new Error('Token không hợp lệ hoặc đã hết hạn')
            }

            // Kiểm tra thời hạn token
            const now = Date.now()
            if (user.resetPasswordExpires < now) {
                throw new Error('Token đã hết hạn')
            }

            // So sánh token người dùng gửi với token đã mã hóa lưu trong DB
            const isMatch = await bcrypt.compare(token, user.resetPasswordToken)
            if (!isMatch) {
                throw new Error('Token không hợp lệ')
            }

            // Mã hóa mật khẩu mới
            const hashedPassword = await bcrypt.hash(newPassword, 10)

            // Cập nhật mật khẩu và xóa token
            const result = await db.collection('users').updateOne(
                { email },
                {
                    $set: {
                        password: hashedPassword,
                    },
                    $unset: {
                        resetPasswordToken: null,
                        resetPasswordExpires: null,
                    },
                }
            )

            return result
        } catch (error) {
            throw new Error('Error resetting password: ' + error.message)
        }
    }
}

export default UserModel
