import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Comment } from '../../../../../models/comment'
import { Post } from '../../../../../models/post'
import { User } from '../../../../../models/user'
import { getToken } from "next-auth/jwt"
import connectDB from '../../../../../lib/connectDB'
import { UnauthorizedError } from '../../../../../errors/unauthorized.error'
import handleError from '../../../../../utils/handleError'

const secret = process.env.JWT_SECRET

const createCommentRunType = Record({
    query: Record({
        postId: String,
    }),
    body: Record({
        body: String,
        replyTo: Optional(String)
    })
})

const getCommentsRunType = Record({
    query: Record({
        postId: String,
        page: Optional(String),
        size: Optional(String)
    })
})

export default async function handler(req, res) {
    await connectDB()
    if (req.method === 'POST') {
        try {
            const token = await getToken({ req, secret })
            if (!token) {
                throw new UnauthorizedError('Unauthorized')
            }
            const name = token.name
            const validatedRequest = createCommentRunType.check(req)
            const { postId } = validatedRequest.query
            const { body, replyTo } = validatedRequest.body

            const comment = new Comment({ postId, userId: token.sub, body, replyTo, replyCount: 0, createdBy: name, createdAt: new Date() })

            await comment.save()

            if (replyTo) {
                await Comment.findOneAndUpdate({ _id: replyTo }, { $inc: { replyCount: 1 } })
            }

            await Post.findOneAndUpdate({ _id: postId }, { updatedAt: new Date() })

            res.send({ comment })
        } catch (error) {
            handleError(error, res)
        }

    } else if (req.method === 'GET') {
        try {
            const validatedRequest = getCommentsRunType.check(req)
            const { postId, page = 1, size = 10 } = validatedRequest.query

            const limit = parseInt(size)
            const skip = (page - 1) * size

            const comments = await Comment.find({ postId, replyTo: { $exists: false } }).sort({ _id: -1 }).limit(limit).skip(skip)

            const commentsWithUsername = await Promise.all(comments.map(async (comment) => {
                const user = await User.findOne({ _id: comment.userId })
                return {
                    ...comment._doc,
                    createdBy: user.name
                }
            }))

            res.send({ comments: commentsWithUsername })
        } catch (error) {
            handleError(error, res)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /comments`)
    }
}
