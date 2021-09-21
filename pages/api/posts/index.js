import { Post } from '../../../models/post'
import { User } from '../../../models/user'
import { Record, String, Optional, Union, Literal } from 'runtypes'
import connectDB from '../../../middleware/mongodb'
import handleError from '../../../utils/handleError'
import jwt from 'next-auth/jwt'
import AWS from 'aws-sdk'

AWS.config.update({
    credentials: new AWS.Credentials({ accessKeyId: process.env.MY_ACCESS_KEY, secretAccessKey: process.env.MY_SECRET }),
    region: process.env.MY_REGION
})

const s3 = new AWS.S3()

const secret = process.env.JWT_SECRET

const getPostsRunType = Record({
    query: Record({
        page: Optional(String),
        size: Optional(String),
        likedTopicsOnly: Optional(Union(Literal('true'), Literal('false')))
    })
})

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const validatedRequest = getPostsRunType.check(req)
            const { likedTopicsOnly, page = 1, size = 10 } = validatedRequest.query
            const limit = parseInt(size)
            const skip = (page - 1) * size
            let posts

            const token = await jwt.getToken({ req, secret })
            if (token && likedTopicsOnly === 'true') {
                const userId = token.sub
                const userDoc = await User.findOne({ _id: userId })
                const likedTopics = Array.from(userDoc.likedTopics.keys())
                posts = await Post.find({ 'topicId': { $in: likedTopics } }).sort({ _id: -1 }).limit(limit).skip(skip)
                // likedTopics && likedTopics.length > 0 ? posts = await Post.find({ 'topicId': { $in: likedTopics } }).sort({ _id: -1 }).limit(limit).skip(skip) : posts = await Post.find({}).sort({ _id: -1 }).limit(limit).skip(skip)
            } else {
                posts = await Post.find({}).sort({ _id: -1 }).limit(limit).skip(skip)
            }

            // token && likedTopics.length > 0 ? await Post.find({ 'topicId': { $in: likedTopics } }).sort({ _id: -1 }).limit(limit).skip(skip) : await Post.find({}).sort({ _id: -1 }).limit(limit).skip(skip)

            const postsWithUsername = await Promise.all(posts.map(async (post) => {
                const user = await User.findOne({ _id: post.userId })
                let image
                let fullImage
                if (post.image) {
                    const params = { Bucket: 'nicole-reed-forum', Key: `${post.userId}/small-${post.image}` }
                    const imageSignedUrl = s3.getSignedUrl('getObject', params)
                    const fullParams = { Bucket: 'nicole-reed-forum', Key: `${post.userId}/${post.image}` }
                    const fullImageSignedUrl = s3.getSignedUrl('getObject', fullParams)
                    image = imageSignedUrl
                    fullImage = fullImageSignedUrl
                }
                return {
                    ...post._doc,
                    createdBy: user.name,
                    image,
                    fullImage
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
