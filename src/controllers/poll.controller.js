import PollModel from '../../models/poll.model.js'
import { ObjectId } from 'mongodb'

// Tạo poll mới
export const createPoll = async (req, res) => {
    try {
        const { title, description, options, expiresAt } = req.body
        const creator = req.user.id // Lấy từ JWT payload

        if (!title || !Array.isArray(options) || options.length < 2) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid poll data' })
        }

        if (!creator || !ObjectId.isValid(creator)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing creator ID',
            })
        }

        const formattedOptions = options.map((opt) => ({
            _id: new ObjectId(),
            text: opt,
            votes: [],
        }))

        // Date tmp = new Date(2025, 2, 7, 9, 30)

        const pollData = {
            title,
            description,
            options: formattedOptions,
            creator: new ObjectId(creator),
            // creator: req.user.id, // Lấy từ JWT payload
            isLocked: false,
            createdAt: new Date(),
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        }

        const poll = await PollModel.createPoll(pollData)

        res.status(201).json({
            success: true,
            message: 'Poll created successfully',
            data: poll,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message,
        })
    }
}

// Lấy tất cả poll
export const getAllPolls = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query
        console.log('>>> Query:', req.query)

        const result = await PollModel.getAllPolls(Number(page), Number(limit))
        console.log('>>> Result:', result)

        res.status(200).json({
            success: true,
            message: 'Get all Poll successfully',
            data: result,
        })
    } catch (err) {
        console.error('🔥 ERROR in getAllPolls:', err)
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message,
        })
    }
}

// Lấy poll theo ID
export const getPollById = async (req, res) => {
    try {
        const poll = await PollModel.getPollById(req.params.id)
        if (!poll) {
            return res
                .status(404)
                .json({ success: false, message: 'Poll not found' })
        }

        const options = poll.options.map((opt) => ({
            id: opt._id,
            text: opt.text,
            votes: opt.votes.length,
            userVote: opt.votes,
        }))

        res.status(200).json({
            success: true,
            message: 'Get Poll successfully',
            data: {
                id: poll._id,
                title: poll.title,
                description: poll.description,
                options,
                creator: {
                    id: poll.creator,
                    username: 'unknown',
                },
                isLocked: poll.isLocked,
                createdAt: poll.createdAt,
                expiresAt: poll.expiresAt,
                totalVotes: options.reduce((sum, o) => sum + o.votes, 0),
            },
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message,
        })
    }
}

export const vote = async (req, res) => {
    try {
        const pollId = req.params.id
        const { optionId } = req.body
        const userId = req.user.id // <-- Lấy từ JWT payload

        // Kiểm tra hợp lệ
        if (
            !ObjectId.isValid(pollId) ||
            !ObjectId.isValid(optionId) ||
            !ObjectId.isValid(userId)
        ) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid ID(s)' })
        }

        // Thực hiện vote
        const result = await PollModel.vote(pollId, optionId, userId)
        if (result.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: 'Vote failed or already voted',
            })
        }

        return res
            .status(200)
            .json({ success: true, message: 'Vote recorded successfully' })
    } catch (error) {
        console.error('🔥 vote error:', error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const unvote = async (req, res) => {
    try {
        const pollId = req.params.id
        const userId = req.user.id // <-- Lấy từ JWT payload

        if (!ObjectId.isValid(pollId) || !ObjectId.isValid(userId)) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid ID(s)' })
        }

        const result = await PollModel.unvote(pollId, userId)
        return res
            .status(200)
            .json({ success: true, message: 'Vote removed successfully' })
    } catch (error) {
        console.error('🔥 unvote error:', error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
