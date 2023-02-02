import { Record, String, Optional } from 'runtypes'
import { Post } from '../../../models/post'
import { User } from '../../../models/user'
import connectDB from '../../../lib/connectDB'
import handleError from '../../../utils/handleError'

const getPostsByKeywordRunType = Record({
    query: Record({
        keyword: String,
        page: Optional(String),
        size: Optional(String)
    })
})

export default async function handler(req, res) {
    await connectDB()
    if (req.method === 'GET') {
        try {
            const validatedRequest = getPostsByKeywordRunType.check(req)
            const { keyword, page = 1, size = 10 } = validatedRequest.query

            const limit = parseInt(size)
            const skip = (page - 1) * size


            const posts = await Post.find({ title: { $regex: `${keyword}`, $options: 'i' } }).sort({ _id: -1 }).limit(limit).skip(skip)

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
        res.status(400).send(`no endpoint ${req.method} /search`)
    }
}
