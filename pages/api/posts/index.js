import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Post } from '../../../models/post'
import connectDB from '../../../middleware/mongodb'

const createPostRunType = Record({
    query: Record({
        topicId: String,
        userId: String,
    }),
    body: Record({
        title: String,
        body: String
    })
})

const handler = async (req, res) => {

    if (req.method === 'POST') {
        try {
            console.log('inside POST users/id/images')
            const validatedRequest = createPostRunType.check(req)
            const { topicId } = validatedRequest.query
            const { title, body } = validatedRequest.body

            const post = new Post({ topicId, title, body, createdAt: new Date() })

            await image.save()

            console.log('sucessfully saved post')
            res.send({ message: `successfully created post ${post.title}` })
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /post`)
    }
}

export default connectDB(handler)