import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Topic } from '../../../../models/topic'
import connectDB from '../../../../middleware/mongodb'

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
            console.log(error)
            res.status(500).send(error.message)
        }

    } else if (req.method === 'DELETE') {
        try {
            const validatedRequest = getTopicByIdRunType.check(req)
            const { topicId } = validatedRequest.query

            await Topic.deleteOne({ _id: topicId })

            res.send({ message: 'successfully deleted topic' })
        } catch (error) {

        }
    } else {
        res.status(400).send(`no endpoint ${req.method} /topicId`)
    }
}

export default connectDB(handler)