import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Topic } from '../../../models/topic'
import handleError from '../../../utils/handleError'
import jwt from 'next-auth/jwt'
import { UnauthorizedError } from '../../../errors/unauthorized.error'
import { ForbiddenError } from '../../../errors/forbidden.error'
import connectDB from '../../../middleware/mongodb'
import { ForbiddenError } from '../../../errors/forbidden.error'

const secret = process.env.JWT_SECRET

const reqRunType = Record({
    body: Record({
        title: String,
        description: String
    })
})

const handler = async (req, res) => {

    if (req.method === 'POST') {
        try {

            const token = await jwt.getToken({ req, secret })

            if (!token) {
                throw new UnauthorizedError('Unauthorized')
            }

            if (token.email !== 'nickreed033@gmail.com') {
                throw new ForbiddenError('Forbidden')
            }

            const validatedRequest = reqRunType.check(req)
            const { title, description } = validatedRequest.body


            const topic = new Topic({ title, description })

            await topic.save()

            res.send(`successfully created topic ${topic.title}`)
        } catch (error) {
            handleError(error, res)
        }
    } else if (req.method === 'GET') {
        try {
            const topics = await Topic.find()

            res.send({ topics })
        } catch (error) {
            handleError(error, res)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /topic`)
    }
}

export default connectDB(handler)
