import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Topic } from '../../../models/topic'
import jwt from 'next/auth'
import connectDB from '../../../middleware/mongodb'

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
                res.status(403).send('Forbidden')
            }

            const validatedRequest = reqRunType.check(req)
            const { title, description } = validatedRequest.body


            const topic = new Topic({ title, description })

            await topic.save()


            res.send(`successfully created topic ${topic.title}`)
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else if (req.method === 'GET') {
        try {
            const topics = await Topic.find()

            res.send({ topics })
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /topic`)
    }
}

export default connectDB(handler)
