import Head from 'next/head'
import FullPost from '../../../components/fullPost'
import NotFound from '../../../components/notfound'
import Layout from '../../../components/layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useSession } from 'next-auth/client'

export default function PostById() {
    const [session, loading] = useSession()
    const [post, setPost] = useState({})
    const [isloading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(false)
    const router = useRouter()
    const { postId } = router.query

    const getPost = async (id) => {
        try {
            const res = await axios.get(`/api/posts/${id}`)

            return res.data.post
        } catch (error) {
            console.log(error.message)
        }
    }

    const getAndSetPost = async (id) => {
        try {
            setLoading(true)
            const post = await getPost(id)

            setPost(post)
            setLoading(false)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        if (router.isReady) {
            getAndSetPost(postId)
        }
    }, [postId])

    return (
        <div >
            <Head>
                <title>Post</title>
            </Head>
            <Layout>

                {loadingError ? <NotFound /> : isloading ? '' : <FullPost post={post} showDelete={session.user.id === post.userId ? true : false} />}
            </Layout>

        </div>
    )
}
