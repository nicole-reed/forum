import { Record, String, Optional, Union, Literal, ValidationError } from 'runtypes'
import { Post } from '../../../models/post'
import connectDB from '../../../middleware/mongodb'

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const posts = await Post.find({}).sort({ _id: -1 }) //sorts by date newest to oldest

            res.send({ posts })
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /posts`)
    }
}

export default connectDB(handler)
