import mongoose from 'mongoose';

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { connection: null }
}

const connectDB = handler => async (req, res) => {
    try {
        if (cached.connection) {
            // Use current db connection
            return handler(req, res);
        }

        // Create new db connection
        cached.connection = await mongoose.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useNewUrlParser: true
        });

        return handler(req, res);
    } catch (error) {
        console.log('error in connectDB', error)
    }
};

export default connectDB;