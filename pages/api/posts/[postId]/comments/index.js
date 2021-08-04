import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Comment } from '../../../../../models/comment'
import { Post } from '../../../../../models/post'
import jwt from 'next-auth/jwt'
import connectDB from '../../../../../middleware/mongodb'
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

const handler = async (req, res) => {

    if (req.method === 'POST') {
        try {
            const token = await jwt.getToken({ req, secret })
            if (!token) {
                throw new UnauthorizedError('Unauthorized')
            }
            const validatedRequest = createCommentRunType.check(req)
            const { postId } = validatedRequest.query
            const { body, replyTo } = validatedRequest.body

            const comment = new Comment({ postId, userId: token.sub, body, replyTo, replyCount: 0 })

            await comment.save()

            if (replyTo) {
                await Comment.findOneAndUpdate({ _id: replyTo }, { $inc: { replyCount: 1 } })
            }

            await Post.findOneAndUpdate({ _id: postId }, { updatedAt: new Date() })

            console.log('sucessfully saved comment')
            res.send({ comment })
        } catch (error) {
            handleError(error, res)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /comments`)
    }
}

export default connectDB(handler)