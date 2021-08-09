import { Post } from '../../../models/post'
import { User } from '../../../models/user'
import connectDB from '../../../middleware/mongodb'
import handleError from '../../../utils/handleError'

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const posts = await Post.find({}).sort({ _id: -1 }) //sorts by date newest to oldest
            const postsWithUsername = await Promise.all(posts.map(async (post) => {
                const user = await User.findOne({ _id: post.userId })
                return {
                    ...post._doc,
                    createdBy: user.name
                }
            }))
            res.send({ posts: postsWithUsername })
        } catch (error) {
            handleError(error, res)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /posts`)
    }
}

export default connectDB(handler)
