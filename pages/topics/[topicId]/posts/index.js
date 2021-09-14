import Head from 'next/head'
import { useSession } from 'next-auth/client'
import Posts from '../../../../components/posts'
import NotFound from '../../../../components/notfound'
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
    const [userHasLikedTopic, setUserHasLikedTopic] = useState(false)


    const getTopic = async () => {
        try {
            const res = await axios.get(`/api/topics/${topicId}`)

            setTopic(res.data.topic)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if (topicId) {
            getTopic()
        }

        if (session) {
            setUserHasLikedTopic(topic.likedBy && topic.likedBy.hasOwnProperty(session.user.id))
        }
    }, [topicId, session])

    const onLike = async () => {
        try {
            await axios.patch(`/api/topics/${topic._id}`, { liked: !userHasLikedTopic })

            getTopic()
        } catch (error) {
            console.log(error.message)
        }
    }


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
        if (session) {
            setUserHasLikedTopic(topic.likedBy && topic.likedBy.hasOwnProperty(session.user.id))
        }
    }, [topicId, session, topic])

    const savePost = async event => {
        try {
            // event.preventDefault()
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
            <Layout>

                <h1>{topic.title}</h1>
                <h3>{topic.description}</h3>
                {session && <button onClick={onLike}>{userHasLikedTopic ? <p className='heart-btn-liked'>♥ liked</p> : <p className='heart-btn-unliked'>♡</p>}</button>}

                {session && <div>
                    <h4>Create A Post For This Topic</h4>
                    <form className='post-form' onSubmit={savePost}>
                        {/* <label htmlFor="name">Post Title: </label> */}
                        <input className='post-title' id='title' name='title' type="text" placeholder='title' required />
                        <br></br>
                        {/* <label htmlFor="name">Body: </label> */}
                        <textarea className='post-body' id='body' name='body' type="text" placeholder='body' required />
                        <br></br>
                        <button type="submit"> Add Post </button>
                        <button type="reset"> Cancel </button>
                    </form>
                </div>}

                <Posts posts={posts} setPosts={setPosts} />
                {pageNumber > 1 && <button onClick={onClickBack}>Back</button>}

                {posts.length === 10 && <button onClick={onClickNext}>Next</button>}



            </Layout>
        </div>
    )
}
