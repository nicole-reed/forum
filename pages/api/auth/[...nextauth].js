import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import jwt from 'jsonwebtoken'

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

    secret: process.env.JWT_SECRET,

    session: {
        // Use JSON Web Tokens for session instead of database sessions.
        // This option can be used with or without a database for users/accounts.
        // Note: `jwt` is automatically set to `true` if no database is specified.
        jwt: true,

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 24 * 60 * 60, // 24 hours
    },

    // JSON Web tokens are only used for sessions if the `jwt: true` session
    // option is set - or by default if no database is specified.
    // https://next-auth.js.org/configuration/options#jwt
    jwt: {
        // A secret to use for key generation (you should set this explicitly)
        secret: process.env.JWT_SECRET,
        // Set to true to use encryption (default: false)
        // encryption: true,
        // You can define your own encode/decode functions for signing and encryption
        // if you want to override the default behaviour.
        // encode: async ({ secret, token, maxAge }) => {
        //     const encodedToken = jwt.sign({
        //         ...token,
        //         iat: Date.now() / 1000,
        //         exp: Math.floor(Date.now() / 1000) + maxAge
        //     }, process.env.JWT_SECRET)
        //     return encodedToken
        // },
        // decode: async ({ secret, token, maxAge }) => {
        //     const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        //     return decodedToken
        // },
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