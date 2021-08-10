import Head from 'next/head'
import Post from '../../../components/post'
import Layout from '../../../components/layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function PostById() {
    const router = useRouter()
    const { postId } = router.query
    const [post, setPost] = useState({})

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

    return (
        <div >
            <Head>
                <title>Post</title>
            </Head>
            <Layout />

            <main>

                <Post post={post} setPost={setPost} />

            </main>
        </div>
    )
}
