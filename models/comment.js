import { Schema, model, models } from 'mongoose'


const CommentSchema = new Schema({
    userId: { type: String },
    postId: { type: String },
    body: { type: String },
    replyTo: { type: String },
    replyCount: { type: Number },
    createdBy: { type: String },
    createdAt: { type: Date },
    likes: { type: Number }
})


export const Comment = models.Comment || model('Comment', CommentSchema)