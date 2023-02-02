import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Comment } from '../../../../../models/comment'
import { User } from '../../../../../models/user'
import connectDB from '../../../../../lib/connectDB'
import handleError from '../../../../../utils/handleError'

const getRepliesRunType = Record({
    query: Record({
        commentId: String,
    })
})

export default async function handler(req, res) {
    await connectDB()
    if (req.method === 'GET') {
        try {
            const validatedRequest = getRepliesRunType.check(req)
            const { commentId } = validatedRequest.query

            const replies = await Comment.find({ replyTo: commentId })
            const repliesWithUsername = await Promise.all(replies.map(async (reply) => {
                const user = await User.findOne({ _id: reply.userId })
                return {
                    ...reply._doc,
                    createdBy: user.name
                }
            }))
            res.send({ replies: repliesWithUsername })
        } catch (error) {
            handleError(error, res)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /replies`)
    }
}
