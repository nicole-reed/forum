import { Record, String, Optional, Boolean } from 'runtypes'
import { Comment } from '../../../../models/comment'
import { User } from '../../../../models/user'
import connectDB from '../../../../middleware/mongodb'
import handleError from '../../../../utils/handleError'
import { UnauthorizedError } from '../../../../errors/unauthorized.error'
import jwt from 'next-auth/jwt'
import { NotFoundError } from '../../../../errors/notFound.error'
import { ForbiddenError } from '../../../../errors/forbidden.error'

const secret = process.env.JWT_SECRET

const getCommentByIdRunType = Record({
    query: Record({
        commentId: String
    })
})

const updateCommentByIdRunType = Record({
    query: Record({
        commentId: String
    }),
    body: Record({
        liked: Optional(Boolean)
    })
})

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const validatedRequest = getCommentByIdRunType.check(req)
            const { commentId } = validatedRequest.query

            const comment = await Comment.findOne({ _id: commentId })
            const user = await User.findOne({ _id: comment.userId })
            const commentWithUsername = { ...comment._doc, createdBy: user.name }

            res.send({ comment: commentWithUsername })
        } catch (error) {
            handleError(error, res)
        }

    } else if (req.method === 'PATCH') {
        try {
            const validatedRequest = updateCommentByIdRunType.check(req)
            const { commentId } = validatedRequest.query
            const { liked } = validatedRequest.body
            const token = await jwt.getToken({ req, secret })

            if (!token) {
                throw new UnauthorizedError('Unauthorized')
            }

            const userId = token.sub

            if ('liked' in validatedRequest.body) {
                if (liked) {
                    await Comment.findOneAndUpdate({ _id: commentId }, { [`likedBy.${userId}`]: new Date() })
                } else {
                    await Comment.findOneAndUpdate({ _id: commentId }, { $unset: { [`likedBy.${userId}`]: '' } })
                }
            }

            res.send({ message: `successfully liked comment` })
        } catch (error) {
            handleError(error, res)
        }
    } else if (req.method === 'DELETE') {
        try {
            const validatedRequest = getCommentByIdRunType.check(req)
            const { commentId } = validatedRequest.query
            const token = await jwt.getToken({ req, secret })

            if (!token) {
                throw new UnauthorizedError('Unauthorized')
            }

            const comment = await Comment.findOne({ _id: commentId })

            if (!comment) {
                throw new NotFoundError('Not Found')
            }

            if (token.sub !== comment.userId) {
                throw new ForbiddenError('Forbidden')
            }

            await Comment.deleteOne({ _id: commentId })

            res.send({ message: 'successfully deleted comment' })
        } catch (error) {
            handleError(error, res)
        }
    } else {
        res.status(400).send(`no endpoint ${req.method} /commentId`)
    }
}

export default connectDB(handler)