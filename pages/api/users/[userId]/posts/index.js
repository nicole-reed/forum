import { Post } from '../../../../../models/post'
import { User } from '../../../../../models/user'
import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import connectDB from '../../../../../lib/connectDB'
import handleError from '../../../../../utils/handleError'
import AWS from 'aws-sdk'

AWS.config.update({
    credentials: new AWS.Credentials({ accessKeyId: process.env.MY_ACCESS_KEY, secretAccessKey: process.env.MY_SECRET }),
    region: process.env.MY_REGION
})

const s3 = new AWS.S3()

const getPostsRunType = Record({
    query: Record({
        userId: String,
        page: Optional(String),
        size: Optional(String)
    })
})

export default async function handler(req, res) {
    await connectDB()
    if (req.method === 'GET') {
        try {
            const validatedRequest = getPostsRunType.check(req)
            const { userId, page = 1, size = 10 } = validatedRequest.query

            const limit = parseInt(size)
            const skip = (page - 1) * size

            const posts = await Post.find({ userId }).sort({ _id: -1 }).limit(limit).skip(skip) //sorts by date newest to oldest,
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
        res.status(400).send(`no endpoint ${req.method} users/userId/posts`)
    }
}