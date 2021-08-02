import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Comment } from '../../../../models/comment'
import connectDB from '../../../../middleware/mongodb'

const getCommentByIdRunType = Record({
    query: Record({
        commentId: String
    })
})

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const validatedRequest = getCommentByIdRunType.check(req)
            const { commentId } = validatedRequest.query

            const comment = await Comment.findOne({ _id: commentId })

            res.send({ comment })
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else if (req.method === 'DELETE') {
        try {
            const validatedRequest = getCommentByIdRunType.check(req)
            const { commentId } = validatedRequest.query

            await Comment.deleteOne({ _id: commentId })

            res.send({ message: 'successfully deleted comment' })
        } catch (error) {

        }
    } else {
        res.status(400).send(`no endpoint ${req.method} /commentId`)
    }
}

export default connectDB(handler)