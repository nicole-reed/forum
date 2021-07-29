import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Comment } from '../../../../../models/comment'
import connectDB from '../../../../../middleware/mongodb'

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
            console.log('inside POST posts/postId/comments')
            const validatedRequest = createCommentRunType.check(req)
            const { postId } = validatedRequest.query
            const { body, commentId } = validatedRequest.body

            const comment = new Comment({ postId, body, replyTo: commentId, replyCount: 0 })

            await comment.save()

            console.log('sucessfully saved comment')
            res.send({ message: `successfully added comment to post ${postId}` })
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /comments`)
    }
}

export default connectDB(handler)