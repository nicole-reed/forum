import Head from 'next/head'
import FullPost from '../../../components/fullPost'
import Layout from '../../../components/layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function PostById() {
    const [post, setPost] = useState({})
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

    return (
        <div >
            <Head>
                <title>Post</title>
            </Head>
            <Layout />

            <main>
                <FullPost post={post} setPost={setPost} />
            </main>
        </div>
    )
}
