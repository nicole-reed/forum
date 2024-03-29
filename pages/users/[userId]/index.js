import Head from 'next/head'
import Posts from '../../../components/posts'
import NotFound from '../../../components/notfound'
import Layout from '../../../components/layout'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Auth from '../../../components/auth'

export default function PostsByUserId() {
    const { data: session } = useSession()
    const router = useRouter()
    const { userId } = router.query
    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [isLoading, setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(false)

    const getUser = async (id) => {
        try {
            const res = await axios.get(`/api/users/${id}`)
            return res.data.user
        } catch (error) {
            console.log(error.message)
            throw error
        }
    }

    const getAndSetUser = async (id) => {
        try {
            // setLoading(true)
            const user = await getUser(id)

            setUser(user)
            // setLoading(false)
        } catch (error) {
            console.log(error.message)
            setLoadingError(true)
            // setLoading(false)
        }
    }

    const getPosts = async (id, page) => {
        try {
            const res = await axios.get(`/api/users/${id}/posts`, { params: { page } })

            return res.data.posts
        } catch (error) {
            console.log(error.message)
            throw error
        }
    }

    const getAndSetPosts = async (id, page) => {
        try {
            // setLoading(true)
            const posts = await getPosts(id, page)
            setPosts(posts)
            // setLoading(false)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(async () => {
        if (userId) {
            setLoading(true)
            await Promise.all([getAndSetPosts(userId, pageNumber), getAndSetUser(userId)])
            setLoading(false)
        }
    }, [userId])

    const onClickNext = async () => {
        try {
            const newPageNumber = pageNumber + 1
            setLoading(true)
            await getAndSetPosts(userId, newPageNumber)
            setLoading(false)
            setPageNumber(newPageNumber)
        } catch (error) {
            console.log(error.message)
        }
    }

    const onClickBack = async () => {
        try {
            const newPageNumber = pageNumber - 1
            setLoading(true)
            await getAndSetPosts(userId, newPageNumber)
            setLoading(false)
            setPageNumber(newPageNumber)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div >
            <Head>
                <title>Profile</title>
            </Head>
            <Layout>
                <Auth />

                {loadingError ? <NotFound /> : <h2>Posts by {user.name}</h2>}

                {isLoading ? '' : <>
                    {posts.length > 0 ? <Posts posts={posts} setPosts={setPosts} /> :
                        <p>None, yet! Choose a <a className='topics-link' href='/topics'>Topic</a> to start posting.</p>
                    }

                    <div className='pagination'>
                        {pageNumber > 1 && <button className='pag-btn' onClick={onClickBack}>Back</button>}

                        {posts.length === 10 && <button className='pag-btn' onClick={onClickNext}>Next</button>}
                    </div>

                </>}

            </Layout>

        </div>
    )
}