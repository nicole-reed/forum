import { Record, String } from 'runtypes'
import { Post } from '../../../../models/post'
import { User } from '../../../../models/user'
import connectDB from '../../../../middleware/mongodb'
import handleError from '../../../../utils/handleError'
import { NotFoundError } from '../../../../errors/notFound.error'


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
            if (!post) {
                throw new NotFoundError('post not found')
            }
            const user = await User.findOne({ _id: post.userId })
            const postWithUsername = { ...post._doc, createdBy: user.name }

            res.send({ post: postWithUsername })
        } catch (error) {
            handleError(error, res)
        }

    } else if (req.method === 'DELETE') {
        try {
            const validatedRequest = getPostByIdRunType.check(req)
            const { postId } = validatedRequest.query

            await Post.deleteOne({ _id: postId })

            res.send({ message: 'successfully deleted post' })
        } catch (error) {
            handleError(error, res)
        }
    } else {
        res.status(400).send(`no endpoint ${req.method} /postId`)
    }
}

export default connectDB(handler)