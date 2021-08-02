import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Comment } from '../../../../../models/comment'
import connectDB from '../../../../../middleware/mongodb'

const getRepliesRunType = Record({
    query: Record({
        commentId: String,
    })
})

const handler = async (req, res) => {

    if (req.method === 'GET') {
        try {
            const validatedRequest = getRepliesRunType.check(req)
            const { commentId } = validatedRequest.query

            const replies = await Comment.find({ replyTo: commentId })

            res.send({ replies })
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /replies`)
    }
}

export default connectDB(handler)