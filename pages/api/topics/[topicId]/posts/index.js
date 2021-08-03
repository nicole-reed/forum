import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Post } from '../../../../../models/post'
import jwt from 'next-auth/jwt'
import connectDB from '../../../../../middleware/mongodb'

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
            const token = await jwt.getToken({ req, secret })
            if (!token) {
                return res.status(403).send('Forbidden')
            }
            const validatedRequest = createPostRunType.check(req)
            const { topicId } = validatedRequest.query
            const { title, body } = validatedRequest.body

            const post = new Post({ topicId, title, body, createdAt: new Date() })

            await post.save()

            console.log('sucessfully saved post')
            res.send({ message: `successfully created post ${post.title}` })
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else if (req.method === 'GET') {
        try {
            console.log('inside GET topics/topicId/posts')
            const validatedRequest = getPostsRunType.check(req)
            const { topicId } = validatedRequest.query

            const posts = await Post.find({ topicId }).sort({ _id: -1 })

            res.send({ posts })
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /post`)
    }
}

export default connectDB(handler)