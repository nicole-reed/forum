import Head from 'next/head'
import Layout from '../components/layout'
import Header from '../components/header'
import { useSession } from 'next-auth/client'
import React from 'react'


export default function Topic() {
    const [session, loading] = useSession()

    return (
        <div >
            <Head>
                <title>Topic</title>
            </Head>
            <Layout />
            <Header />
        </div>
    )
}

