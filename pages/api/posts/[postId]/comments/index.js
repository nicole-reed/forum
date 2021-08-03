import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Comment } from '../../../../../models/comment'
import jwt from 'next/auth'
import connectDB from '../../../../../middleware/mongodb'

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
                return res.status(403).send('Forbidden')
            }
            const validatedRequest = createCommentRunType.check(req)
            const { postId } = validatedRequest.query
            const { body, replyTo } = validatedRequest.body

            const comment = new Comment({ postId, body, replyTo, replyCount: 0 })

            await comment.save()

            if (replyTo) {
                await Comment.findOneAndUpdate({ _id: replyTo }, { $inc: { replyCount: 1 } })
            }

            console.log('sucessfully saved comment')
            res.send({ comment })
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /comments`)
    }
}

export default connectDB(handler)