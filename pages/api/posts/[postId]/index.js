import { Record, String, Optional, Boolean } from 'runtypes'
import { Post } from '../../../../models/post'
import { User } from '../../../../models/user'
import connectDB from '../../../../middleware/mongodb'
import handleError from '../../../../utils/handleError'
import { NotFoundError } from '../../../../errors/notFound.error'
import jwt from 'next-auth/jwt'
import { ForbiddenError } from '../../../../errors/forbidden.error'
import AWS from 'aws-sdk'

AWS.config.update({
    credentials: new AWS.Credentials({ accessKeyId: process.env.MY_ACCESS_KEY, secretAccessKey: process.env.MY_SECRET }),
    region: process.env.MY_REGION
})

const s3 = new AWS.S3()

const secret = process.env.JWT_SECRET

const getPostByIdRunType = Record({
    query: Record({
        postId: String
    })
})

const updatePostByIdRunType = Record({
    query: Record({
        postId: String
    }),
    body: Record({
        liked: Optional(Boolean)
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

            if (post.image) {
                const params = { Bucket: 'nicole-reed-forum', Key: `${post.userId}/medium-${post.image}` }
                const imageSignedUrl = s3.getSignedUrl('getObject', params)
                const fullParams = { Bucket: 'nicole-reed-forum', Key: `${post.userId}/${post.image}` }
                const fullImageSignedUrl = s3.getSignedUrl('getObject', fullParams)
                postWithUsername.image = imageSignedUrl
                postWithUsername.fullImage = fullImageSignedUrl
            }

            res.send({ post: postWithUsername })
        } catch (error) {
            handleError(error, res)
        }

    } else if (req.method === 'PATCH') {
        try {
            const validatedRequest = updatePostByIdRunType.check(req)
            const { postId } = validatedRequest.query
            const { liked } = validatedRequest.body
            const token = await jwt.getToken({ req, secret })

            if (!token) {
                throw new UnauthorizedError('Unauthorized')
            }

            const userId = token.sub

            if ('liked' in validatedRequest.body) {
                if (liked) {
                    await Post.findOneAndUpdate({ _id: postId }, { [`likedBy.${userId}`]: new Date() })
                } else {
                    await Post.findOneAndUpdate({ _id: postId }, { $unset: { [`likedBy.${userId}`]: '' } })
                }
            }

            res.send({ message: `successfully liked post` })
        } catch (error) {
            handleError(error, res)
        }
    } else if (req.method === 'DELETE') {
        try {
            const validatedRequest = getPostByIdRunType.check(req)
            const { postId } = validatedRequest.query
            const token = await jwt.getToken({ req, secret })

            if (!token) {
                throw new UnauthorizedError('Unauthorized')
            }

            const post = await Post.findOne({ _id: postId })

            if (!post) {
                throw new NotFoundError('Not Found')
            }

            if (token.sub !== post.userId) {
                throw new ForbiddenError('Forbidden')
            }

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