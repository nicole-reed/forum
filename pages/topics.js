import Head from 'next/head'
import Layout from '../components/layout'
import { useSession } from 'next-auth/client'
import Topics from '../components/topics'
import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function Topic() {
    const [session, loading] = useSession()
    const [topics, setTopics] = useState([])

    const getTopics = async () => {
        try {
            const res = await axios.get('/api/topics')

            setTopics(res.data.topics)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getTopics()
    }, [])

    return (
        <div >
            <Head>
                <title>Topic</title>
            </Head>
            <Layout>
                <br></br>
                <Topics topics={topics} />
            </Layout>
        </div>
    )
}

