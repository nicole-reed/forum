import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Topic } from '../../../models/topic'
import connectDB from '../../../middleware/mongodb'

const reqRunType = Record({
    body: Record({
        title: String,
        description: String
    })
})

const handler = async (req, res) => {

    if (req.method === 'POST') {
        try {
            console.log('inside createTopic')

            const validatedRequest = reqRunType.check(req)
            const { title, description } = validatedRequest.body


            const topic = new Topic({ title, description })

            await topic.save()


            res.send(`successfully created topic ${topic.title}`)
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /topic`)
    }
}

export default connectDB(handler)
