import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/client'
import Posts from '../../../../components/posts'
import Layout from '../../../../components/layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function PostsByTopic() {
    const [session, loading] = useSession()

    const router = useRouter()
    const { topicId } = router.query
    const [topic, setTopic] = useState({})
    const [posts, setPosts] = useState([])
    const [pageNumber, setPageNumber] = useState(1)

    const getTopic = async () => {
        try {
            const res = await axios.get(`/api/topics/${topicId}`)

            setTopic(res.data.topic)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getTopic()
    }, [topicId])

    const getPosts = async (page) => {
        try {
            const res = await axios.get(`/api/topics/${topicId}/posts`, { params: { page } })

            setPosts(res.data.posts)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getPosts(pageNumber)
    }, [topicId])

    const savePost = async event => {
        try {
            event.preventDefault()
            const res = await axios.post(`/api/topics/${topicId}/posts`, { title: event.target.title.value, body: event.target.body.value })

        } catch (error) {
            console.log(error)
        }
    }

    const onClickNext = () => {
        try {
            const newPageNumber = pageNumber + 1
            getPosts(newPageNumber)
            setPageNumber(newPageNumber)
        } catch (error) {
            console.log(error.message)
        }
    }

    const onClickBack = () => {
        try {
            const newPageNumber = pageNumber - 1
            getPosts(newPageNumber)
            setPageNumber(newPageNumber)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div >
            <Head>
                <title>Posts</title>
            </Head>
            <Layout />

            <main>
                <h2>{topic.title}</h2>
                <h3>{topic.description}</h3>

                {session && <>
                    <h1>Create A Post</h1>
                    <form onSubmit={savePost}>
                        <label htmlFor="name">Post Title: </label>
                        <input id='title' name='title' type="text" placeholder='title' required />
                        <br></br>
                        <label htmlFor="name">Body: </label>
                        <input id='body' name='body' type="text" placeholder='body' required />
                        <br></br>
                        <button type="submit"> Add Post </button>
                    </form>
                </>}


                <Posts posts={posts} setPosts={setPosts} />
                {pageNumber > 1 && <button onClick={onClickBack}>Back</button>}

                {posts.length === 10 && <button onClick={onClickNext}>Next</button>}

            </main>
        </div>
    )
}
