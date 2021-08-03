import Head from 'next/head'
import Layout from '../components/layout'
import { useSession } from 'next-auth/client'
import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function Profile() {
    const [session, loading] = useSession()

    const callTopicApi = async () => {
        try {
            console.log('session', session)
            const res = await axios.post(`/api/topics`, { title: 'New Topic Creation', description: 'This is a test topic.' })


        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div >
            <Head>
                <title>Topic</title>
            </Head>
            <Layout />

            <main>

                <button onClick={callTopicApi}>call APi</button>


            </main>


        </div>
    )
}

