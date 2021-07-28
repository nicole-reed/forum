import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
    providers: [
        // OAuth authentication providers...
        // Providers.Facebook({
        //     clientId: process.env.FACEBOOK_ID,
        //     clientSecret: process.env.FACEBOOK_SECRET
        // }),
        Providers.Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],
    // Optional SQL or MongoDB database to persist users
    database: process.env.MONGODB_URI,

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