import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],
    // Optional SQL or MongoDB database to persist users
    database: process.env.MONGODB_URI,
    secret: process.env.JWT_SECRET,
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    callbacks: {
        async session(session, user) {

            return { ...session, user: { ...session.user, id: user.sub } }
        },
        async redirect(url, baseUrl) {
            return url.startsWith(baseUrl)
                ? url
                : baseUrl
        }
    }
})