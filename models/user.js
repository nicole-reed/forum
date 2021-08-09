import { Schema, model, models } from 'mongoose'


const UserSchema = new Schema({
    name: { type: String },
    email: { type: String },
    image: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date }
})


export const User = models.User || model('User', UserSchema)