import { Schema, model, models } from 'mongoose'


const TopicSchema = new Schema({
    title: { type: String },
    body: { type: String }
})


export const Topic = models.Topic || model('Topic', TopicSchema)