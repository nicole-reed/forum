import Head from 'next/head'
import Layout from '../components/layout'
import { useSession } from 'next-auth/client'
import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function Topic() {
    const [session, loading] = useSession()


    const saveTopic = async event => {
        try {
            const res = await axios.post('/api/topics', { title: event.target.title.value, description: event.target.description.value })
        } catch (error) {
            toastr.error(error.response.data)
        }
    }

    return (
        <div >
            <Head>
                <title>Topic</title>
            </Head>
            <Layout />

            <main>
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

                {/* <button onClick={callTopicApi}>call APi</button> */}


            </main>


        </div>
    )
}

