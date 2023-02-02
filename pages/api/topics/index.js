import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Topic } from '../../../models/topic'
import handleError from '../../../utils/handleError'
import { getToken } from "next-auth/jwt"
import { UnauthorizedError } from '../../../errors/unauthorized.error'
import connectDB from '../../../lib/connectDB'
import { ForbiddenError } from '../../../errors/forbidden.error'

const secret = process.env.JWT_SECRET

const reqRunType = Record({
    body: Record({
        title: String,
        description: String
    })
})

export default async function handler(req, res) {
    await connectDB()
    if (req.method === 'POST') {
        try {

            const token = await getToken({ req, secret })

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


