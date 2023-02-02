import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from '../../../lib/mongoDB'

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code'
                }
            }
        }),
    ],
    // Optional SQL or MongoDB database to persist users
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.JWT_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    callbacks: {
        // async session({ session, user }) {

        //     return { ...session, user: { ...session.user, id: user.id } }
        // },
        // async redirect({ url, baseUrl }) {
        //     return url.toString().startsWith(baseUrl)
        //         ? url
        //         : baseUrl
        // }
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, user, token }) {
            // return session
            return { ...session, user: { ...session.user, id: token.sub } }
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
        }
    }
})