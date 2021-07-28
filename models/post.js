import { Schema, model, models } from 'mongoose'


const PostSchema = new Schema({
    userId: { type: String },
    topicId: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    title: { type: String },
    body: { type: String }
})


export const Post = models.Post || model('Post', PostSchema)