import { Schema, model, models } from 'mongoose'


const CommentSchema = new Schema({
    usesr: { type: String },
    postId: { type: String },
    body: { type: String },
    replyTo: { type: String },
    replyCount: { type: Number }
})


export const Comment = models.Comment || model('Comment', CommentSchema)