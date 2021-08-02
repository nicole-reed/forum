import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Post } from '../../../../models/post'
import connectDB from '../../../../middleware/mongodb'

const getPostByIdRunType = Record({
    query: Record({
        postId: String
    })
})

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const validatedRequest = getPostByIdRunType.check(req)
            const { postId } = validatedRequest.query

            const post = await Post.findOne({ _id: postId })

            res.send({ post })
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else if (req.method === 'DELETE') {
        try {
            const validatedRequest = getPostByIdRunType.check(req)
            const { postId } = validatedRequest.query

            await Post.deleteOne({ _id: postId })

            res.send('successfully deleted post')
        } catch (error) {

        }
    } else {
        res.status(400).send(`no endpoint ${req.method} /postId`)
    }
}

export default connectDB(handler)