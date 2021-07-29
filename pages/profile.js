import Head from 'next/head'
import Layout from '../components/layout'
import { useSession } from 'next-auth/client'
import React from 'react'

export default function Profile() {
    const [session, loading] = useSession()
    console.log('session', session)
    return (
        <div >
            <Head>
                <title>Profile</title>
            </Head>
            <Layout />

            <main>
                {session && <>

                    <h2>Posts by {session.user.email}</h2>
                </>}

            </main>


        </div>
    )
}
