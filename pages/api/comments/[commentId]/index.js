import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Comment } from '../../../../models/comment'
import { User } from '../../../../models/user'
import connectDB from '../../../../middleware/mongodb'
import handleError from '../../../../utils/handleError'

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
            const user = await User.findOne({ _id: comment.userId })
            const commentWithUsername = { ...comment._doc, createdBy: user.name }

            res.send({ comment: commentWithUsername })
        } catch (error) {
            handleError(error, res)
        }

    } else if (req.method === 'DELETE') {
        try {
            const validatedRequest = getCommentByIdRunType.check(req)
            const { commentId } = validatedRequest.query

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