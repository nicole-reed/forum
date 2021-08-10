import Head from 'next/head'
import { useSession } from 'next-auth/client'
import FullPost from '../../../components/fullPost'
import Comments from '../../../components/comments'
import Layout from '../../../components/layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function PostById() {
    const [session, loading] = useSession()
    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    const router = useRouter()
    const { postId } = router.query

    const getPost = async () => {
        try {
            const res = await axios.get(`/api/posts/${postId}`)

            setPost(res.data.post)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getPost()
    }, [postId])

    const getComments = async () => {
        try {
            const res = await axios.get(`/api/posts/${postId}/comments`)
            console.log('res', res)

            setComments(res.data.comments)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getComments()
    }, [postId])

    const saveComment = async event => {
        try {
            event.preventDefault()
            const res = await axios.post(`/api/posts/${postId}/comments`, { body: event.target.body.value })

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div >
            <Head>
                <title>Post</title>
            </Head>
            <Layout />

            <main>

                <FullPost post={post} setPost={setPost} />

                <div>
                    {session && <>
                        <h3>Add A Comment</h3>
                        <form onSubmit={saveComment}>
                            <input id='body' name='body' type="text" placeholder='body' required />
                            <br></br>
                            <button type="submit"> Add Comment </button>
                        </form>
                    </>}
                </div>
                <Comments comments={comments} />
            </main>
        </div>
    )
}
