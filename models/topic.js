import { Schema, model, models } from 'mongoose'


const TopicSchema = new Schema({
    title: { type: String },
    description: { type: String },
    likedBy: { type: Map, of: String }
})


export const Topic = models.Topic || model('Topic', TopicSchema)