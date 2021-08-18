import Head from 'next/head'
import FullPost from '../../../components/fullPost'
import NotFound from '../../../components/notfound'
import Layout from '../../../components/layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function PostById() {
    const [post, setPost] = useState({})
    const [loading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(false)
    const router = useRouter()
    const { postId } = router.query

    const getPost = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/posts/${postId}`)

            setPost(res.data.post)
            setLoading(false)
        } catch (error) {
            console.log(error.message)
            setLoadingError(true)
            setLoading(false)
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
            <Layout>

                {loadingError ? <NotFound /> : loading ? '' : <FullPost post={post} />}
            </Layout>

        </div>
    )
}
