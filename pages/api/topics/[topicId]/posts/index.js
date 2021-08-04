import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Post } from '../../../../../models/post'
import jwt from 'next-auth/jwt'
import connectDB from '../../../../../middleware/mongodb'
import { UnauthorizedError } from '../../../../../errors/unauthorized.error'
import handleError from '../../../../../utils/handleError'

const secret = process.env.JWT_SECRET

const createPostRunType = Record({
    query: Record({
        topicId: String,
    }),
    body: Record({
        title: String,
        body: String
    })
})

const getPostsRunType = Record({
    query: Record({
        topicId: String
    })
})

const handler = async (req, res) => {

    if (req.method === 'POST') {
        try {
            console.log('in createPOst endpoint')
            const token = await jwt.getToken({ req, secret })
            if (!token) {
                throw new UnauthorizedError('Unauthorized')
            }
            const validatedRequest = createPostRunType.check(req)
            const { topicId } = validatedRequest.query
            const { title, body } = validatedRequest.body

            const post = new Post({ topicId, userId: token.sub, title, body, createdAt: new Date() })

            await post.save()

            console.log('sucessfully saved post')
            res.send({ message: `successfully created post ${post.title}` })
        } catch (error) {
            handleError(error, res)
        }

    } else if (req.method === 'GET') {
        try {
            const validatedRequest = getPostsRunType.check(req)
            const { topicId } = validatedRequest.query

            const posts = await Post.find({ topicId }).sort({ _id: -1 })

            res.send({ posts })
        } catch (error) {
            handleError(error, res)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /post`)
    }
}

export default connectDB(handler)