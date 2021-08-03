import { NotFoundError } from '../errors/notFound.error'
import { ForbiddenError } from '../errors/forbidden.error'
import { UnauthorizedError } from '../errors/unauthorized.error'
import { ValidationError } from 'runtypes'

export default function handleError(error, res) {

    if (error instanceof NotFoundError) {
        res.status(404).send({ message: error.message })

    } else if (error instanceof ForbiddenError) {
        res.status(403).send({ message: error.message })

    } else if (error instanceof UnauthorizedError) {
        res.status(401).send({ message: error.message })

    } else if (error instanceof ValidationError) {
        res.status(401).send({ message: error.message, details: error.details })

    } else {
        res.status(500).send({ message: error.message || 'Unexpected error has occured.' })
    }
}