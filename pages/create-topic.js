import Head from 'next/head'
import Layout from '../components/layout'
import { useSession } from 'next-auth/client'
import React from 'react'
import axios from 'axios'

export default function createTopic() {
    const [session, loading] = useSession()

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
                <title>Create Topic</title>
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
            </Layout>
        </div>
    )
}

