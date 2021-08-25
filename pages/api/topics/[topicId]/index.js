import { Record, String, Optional, Boolean } from 'runtypes'
import { Topic } from '../../../../models/topic'
import { User } from '../../../../models/user'
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

const updateTopicByTopicIdRunType = Record({
    query: Record({
        topicId: String
    }),
    body: Record({
        liked: Optional(Boolean)
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

    } else if (req.method === 'PATCH') {
        try {
            const validatedRequest = updateTopicByTopicIdRunType.check(req)
            const { topicId } = validatedRequest.query
            const { liked } = validatedRequest.body
            const token = await jwt.getToken({ req, secret })

            if (!token) {
                throw new UnauthorizedError('Unauthorized')
            }

            const userId = token.sub

            if ('liked' in validatedRequest.body) {
                if (liked) {
                    await Promise.all([
                        User.findOneAndUpdate({ _id: userId }, { [`likedTopics.${topicId}`]: new Date() }),
                        Topic.findOneAndUpdate({ _id: topicId }, { [`likedBy.${userId}`]: new Date() })
                    ])

                } else {
                    await Promise.all([
                        User.findOneAndUpdate({ _id: userId }, { $unset: { [`likedTopics.${topicId}`]: '' } }),
                        Topic.findOneAndUpdate({ _id: topicId }, { $unset: { [`likedBy.${userId}`]: '' } })
                    ])
                }
            }

            res.send({ message: `successfully liked topic` })
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