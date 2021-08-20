import { Post } from '../../../models/post'
import { User } from '../../../models/user'
import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import connectDB from '../../../middleware/mongodb'
import handleError from '../../../utils/handleError'
import jwt from 'next-auth/jwt'

const secret = process.env.JWT_SECRET

const getPostsRunType = Record({
    query: Record({
        page: Optional(String),
        size: Optional(String)
    })
})

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const validatedRequest = getPostsRunType.check(req)
            const { page = 1, size = 10 } = validatedRequest.query
            const limit = parseInt(size)
            const skip = (page - 1) * size

            const token = await jwt.getToken({ req, secret })
            const userId = token.sub
            const userDoc = await User.findOne({ _id: userId })
            const likedTopics = Array.from(userDoc.likedTopics.keys())

            const posts = token && likedTopics.length > 0 ? await Post.find({ 'topicId': { $in: likedTopics } }).sort({ _id: -1 }).limit(limit).skip(skip) : await Post.find({}).sort({ _id: -1 }).limit(limit).skip(skip)

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
