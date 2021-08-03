import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Topic } from '../../../../models/topic'
import connectDB from '../../../../middleware/mongodb'
import jwt from 'next-auth/jwt'
import { ForbiddenError } from '../../../../errors/forbidden.error'
import { UnauthorizedError } from '../../../../errors/unauthorized.error'
import handleError from '../../../../utils/handleError'

const secret = process.env.JWT_SECRET

const getTopicByIdRunType = Record({
    query: Record({
        topicId: String
    })
})

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const validatedRequest = getTopicByIdRunType.check(req)
            const { topicId } = validatedRequest.query

            const topic = await Topic.findOne({ _id: topicId })

            res.send({ topic })
        } catch (error) {
            handleError(error, res)
        }

    } else if (req.method === 'DELETE') {
        try {
            const token = jwt.getToken({ req, secret })
            if (!token) {
                throw new UnauthorizedError('Unauthorized')
            }

            if (token.email !== 'nickreed033@gmail.com') {
                throw new ForbiddenError('Forbidden')
            }

            const validatedRequest = getTopicByIdRunType.check(req)
            const { topicId } = validatedRequest.query

            await Topic.deleteOne({ _id: topicId })

            res.send({ message: 'successfully deleted topic' })
        } catch (error) {
            handleError(error, res)
        }
    } else {
        res.status(400).send(`no endpoint ${req.method} /topicId`)
    }
}

export default connectDB(handler)