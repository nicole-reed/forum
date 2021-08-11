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
        if (router.isReady) {
            getPost()
        }
    }, [postId])

    const getComments = async () => {
        try {
            const res = await axios.get(`/api/posts/${postId}/comments`)

            setComments(res.data.comments)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getComments()
    }, [postId])

    return (
        <div >
            <Head>
                <title>Post</title>
            </Head>
            <Layout />

            <main>

                <FullPost post={post} setPost={setPost} />
                <Comments comments={comments} />

            </main>
        </div>
    )
}
