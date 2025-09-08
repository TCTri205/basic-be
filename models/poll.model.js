// import { getDB } from '../src/config/db.config.js'
// import { ObjectId } from 'mongodb'

// class PollModel {
//     static async createPoll(data) {
//         try {
//             const result = await getDB().collection('polls').insertOne(data)
//             return { _id: result.insertedId, ...data }
//         } catch (error) {
//             throw new Error('Error creating poll: ' + error.message)
//         }
//     }

//     static async getAllPolls(page = 1, limit = 10) {
//         try {
//             const skip = (page - 1) * limit
//             const cursor = getDB()
//                 .collection('polls')
//                 .find({})
//                 .skip(skip)
//                 .limit(limit)

//             const polls = await cursor.toArray()
//             const total = await getDB().collection('polls').countDocuments()

//             return { polls, total, page, limit }
//         } catch (error) {
//             throw new Error('Error fetching polls: ' + error.message)
//         }
//     }

//     static async getPollById(id) {
//         try {
//             const poll = await getDB()
//                 .collection('polls')
//                 .findOne({ _id: new ObjectId(id) })
//             return poll
//         } catch (error) {
//             throw new Error('Error fetching poll by ID: ' + error.message)
//         }
//     }

//     static async vote(pollId, optionId, userId) {
//         try {
//             const result = await getDB()
//                 .collection('polls')
//                 .updateOne(
//                     {
//                         _id: new ObjectId(pollId),
//                         'options._id': new ObjectId(optionId),
//                         'options.votes': { $ne: new ObjectId(userId) }, // tránh vote 2 lần
//                     },
//                     {
//                         $push: {
//                             'options.$.votes': new ObjectId(userId),
//                         },
//                     }
//                 )
//             return result
//         } catch (error) {
//             throw new Error('Error voting: ' + error.message)
//         }
//     }

//     static async unvote(pollId, userId) {
//         try {
//             const result = await getDB()
//                 .collection('polls')
//                 .updateMany(
//                     {
//                         _id: new ObjectId(pollId),
//                     },
//                     {
//                         $pull: {
//                             'options.$[].votes': new ObjectId(userId),
//                         },
//                     }
//                 )
//             return result
//         } catch (error) {
//             throw new Error('Error unvoting: ' + error.message)
//         }
//     }
// }

// export default PollModel

import { getDB } from '../src/config/db.config.js'
import { ObjectId } from 'mongodb'

class PollModel {
    // Tạo một poll mới
    static async createPoll(data) {
        try {
            const result = await getDB().collection('polls').insertOne(data)
            return { _id: result.insertedId, ...data }
        } catch (error) {
            throw new Error('[createPoll] ' + error.message)
        }
    }

    // Lấy tất cả polls có phân trang
    static async getAllPolls(page = 1, limit = 10) {
        try {
            const db = getDB()
            const skip = (page - 1) * limit

            const polls = await db
                .collection('polls')
                .find({})
                .skip(skip)
                .limit(limit)
                .toArray()

            const total = await db.collection('polls').countDocuments()

            return { polls, total, page, limit }
        } catch (error) {
            throw new Error('[getAllPolls] ' + error.message)
        }
    }

    // Lấy poll theo ID
    static async getPollById(id) {
        try {
            if (!ObjectId.isValid(id)) throw new Error('Invalid poll ID')

            const poll = await getDB()
                .collection('polls')
                .findOne({
                    _id: new ObjectId(id),
                })

            return poll
        } catch (error) {
            throw new Error('[getPollById] ' + error.message)
        }
    }

    // Bỏ phiếu cho một option
    static async vote(pollId, optionId, userId) {
        try {
            if (
                !ObjectId.isValid(pollId) ||
                !ObjectId.isValid(optionId) ||
                !ObjectId.isValid(userId)
            ) {
                throw new Error('Invalid vote IDs')
            }

            const result = await getDB()
                .collection('polls')
                .updateOne(
                    {
                        _id: new ObjectId(pollId),
                        'options._id': new ObjectId(optionId),
                        'options.votes': { $ne: new ObjectId(userId) }, // tránh vote trùng
                    },
                    {
                        $push: {
                            'options.$.votes': new ObjectId(userId),
                        },
                    }
                )

            return result
        } catch (error) {
            throw new Error('[vote] ' + error.message)
        }
    }

    // Gỡ vote khỏi tất cả các option trong poll
    static async unvote(pollId, userId) {
        try {
            if (!ObjectId.isValid(pollId) || !ObjectId.isValid(userId)) {
                throw new Error('Invalid unvote IDs')
            }

            const result = await getDB()
                .collection('polls')
                .updateMany(
                    { _id: new ObjectId(pollId) },
                    {
                        $pull: {
                            'options.$[].votes': new ObjectId(userId),
                        },
                    }
                )

            return result
        } catch (error) {
            throw new Error('[unvote] ' + error.message)
        }
    }
}

export default PollModel
