import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Post } from '../../../../../models/post'
import { User } from '../../../../../models/user'
import jwt from 'next-auth/jwt'
import connectDB from '../../../../../middleware/mongodb'
import { UnauthorizedError } from '../../../../../errors/unauthorized.error'
import handleError from '../../../../../utils/handleError'
import AWS from 'aws-sdk'

AWS.config.update({
    credentials: new AWS.Credentials({ accessKeyId: process.env.MY_ACCESS_KEY, secretAccessKey: process.env.MY_SECRET }),
    region: process.env.MY_REGION
})

const s3 = new AWS.S3()

const secret = process.env.JWT_SECRET

const createPostRunType = Record({
    query: Record({
        topicId: String,
    }),
    body: Record({
        title: String,
        body: String,
        image: Optional(String)
    })
})

const getPostsRunType = Record({
    query: Record({
        topicId: String,
        page: Optional(String),
        size: Optional(String)
    })
})

const handler = async (req, res) => {

    if (req.method === 'POST') {
        try {
            const token = await jwt.getToken({ req, secret })

            if (!token) {
                throw new UnauthorizedError('Unauthorized')
            }

            const validatedRequest = createPostRunType.check(req)
            const { topicId } = validatedRequest.query
            const { title, body, image } = validatedRequest.body

            const post = new Post({ topicId, userId: token.sub, title, body, createdAt: new Date(), image })

            await post.save()

            res.send({ message: `successfully created post ${post.title}` })
        } catch (error) {
            handleError(error, res)
        }

    } else if (req.method === 'GET') {
        try {
            const validatedRequest = getPostsRunType.check(req)
            const { topicId, page = 1, size = 10 } = validatedRequest.query

            const limit = parseInt(size)
            const skip = (page - 1) * size

            const posts = await Post.find({ topicId }).sort({ _id: -1 }).limit(limit).skip(skip)

            const postsWithUsernameAndImage = await Promise.all(posts.map(async (post) => {
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

            res.send({ posts: postsWithUsernameAndImage })
        } catch (error) {
            handleError(error, res)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /post`)
    }
}

export default connectDB(handler)