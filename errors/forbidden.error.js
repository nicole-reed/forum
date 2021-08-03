export class ForbiddenError extends Error {
    constructor(message) {
        super(message)
        // this.statusCode = 403
    }
}