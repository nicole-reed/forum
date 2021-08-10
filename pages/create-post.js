import Head from 'next/head'
import Layout from '../components/layout'
import { useSession } from 'next-auth/client'
import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function createPost() {
    const [session, loading] = useSession()

    const savePost = async event => {
        try {
            event.preventDefault()
            const res = await axios.post(`/api/topics/${event.target.topicId.value}/posts`, { title: event.target.title.value, body: event.target.body.value })

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div >
            <Head>
                <title>Post</title>
            </Head>
            <Layout />

            <main>
                {session && <>
                    <h1>Create A Post</h1>
                    <form onSubmit={savePost}>
                        <label htmlFor="name">Topic: </label>
                        <input id='topicId' name='topicId' type="text" placeholder='topicId' required />
                        <br></br>
                        <label htmlFor="name">Post Title: </label>
                        <input id='title' name='title' type="text" placeholder='Post' required />
                        <br></br>
                        <label htmlFor="name">Body: </label>
                        <input id='body' name='body' type="text" placeholder='body' required />
                        <br></br>
                        <button type="submit"> Add Post </button>
                    </form>
                </>}

                {/* <button onClick={callTopicApi}>call APi</button> */}


            </main>


        </div>
    )
}

