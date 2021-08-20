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
            console.log(res.data.topics)
            setTopics(res.data.topics)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getTopics()
    }, [])


    const saveTopic = async event => {
        try {
            const res = await axios.post('/api/topics', { title: event.target.title.value, description: event.target.description.value })
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div >
            <Head>
                <title>Topic</title>
            </Head>
            <Layout>
                {session && <>
                    <h1>Create A Topic</h1>
                    <form onSubmit={saveTopic}>
                        <label htmlFor="name">Topic: </label>
                        <input id='title' name='title' type="text" placeholder='Topic' required />
                        <br></br>
                        <label htmlFor="name">Please Add A Description For The Topic: </label>
                        <input id='description' name='description' type="text" placeholder='description' required />
                        <br></br>
                        <button type="submit"> Add Topic </button>
                    </form>
                </>}
                <Topics topics={topics} />
            </Layout>
        </div>
    )
}

