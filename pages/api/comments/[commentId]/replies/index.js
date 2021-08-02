import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Comment } from '../../../../../models/comment'
import connectDB from '../../../../../middleware/mongodb'

const getReplyRunType = Record({
    query: Record({
        commentId: String,
    })
})

const handler = async (req, res) => {

    if (req.method === 'GET') {
        try {
            console.log('inside GET comments/commentId/replies')
            const validatedRequest = getReplyRunType.check(req)
            const { commentId } = validatedRequest.query

            const replies = await Comment.find({ replyTo: commentId })

            res.send({ replies })
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /replies`)
    }
}

export default connectDB(handler)