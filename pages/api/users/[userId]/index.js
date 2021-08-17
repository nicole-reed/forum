import { Record, String } from 'runtypes'
import { User } from '../../../../models/user'
import connectDB from '../../../../middleware/mongodb'
import handleError from '../../../../utils/handleError'


const getUserByIdRunType = Record({
    query: Record({
        userId: String
    })
})

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const validatedRequest = getUserByIdRunType.check(req)
            const { userId } = validatedRequest.query

            const user = await User.findOne({ _id: userId })

            res.send({ user })
        } catch (error) {
            handleError(error, res)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /users/userId`)
    }
}

export default connectDB(handler)