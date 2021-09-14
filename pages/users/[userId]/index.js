import Head from 'next/head'
import Posts from '../../../components/posts'
import NotFound from '../../../components/notfound'
import Layout from '../../../components/layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import axios from 'axios'
import Auth from '../../../components/auth'

export default function PostsByUserId() {
    const { session, loading } = useSession()
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
            setLoading(true)
            const user = await getUser(id)

            setUser(user)
            setLoading(false)
        } catch (error) {
            console.log(error.message)
            setLoadingError(true)
            setLoading(false)
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
            const posts = await getPosts(id, page)
            setPosts(posts)

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(async () => {
        if (userId) {
            getAndSetPosts(userId, pageNumber)
            getAndSetUser(userId)
        }
    }, [userId])

    const onClickNext = async () => {
        try {
            const newPageNumber = pageNumber + 1
            getAndSetPosts(userId, newPageNumber)
            setPageNumber(newPageNumber)
        } catch (error) {
            console.log(error.message)
        }
    }

    const onClickBack = async () => {
        try {
            const newPageNumber = pageNumber - 1
            getAndSetPosts(userId, newPageNumber)
            setPageNumber(newPageNumber)
        } catch (error) {
            console.log(error.message)
        }
    }

    // console.log('session.user.id', session.user)
    // console.log('userId', userId)
    // console.log('user._id', user._id)

    return (
        <div >
            <Head>
                <title>Profile</title>
            </Head>
            <Layout>
                <Auth />

                {loadingError ? <NotFound /> : isLoading ? '' : <h2>Posts by {user.name}</h2>}

                {posts.length < 1 ? <p>Choose a <a className='topics-link' href='/topics'>Topic</a> to start posting!</p> : ''}

                <Posts posts={posts} setPosts={setPosts} />

                <div className='pagination'>
                    {pageNumber > 1 && <button className='pag-btn' onClick={onClickBack}>Back</button>}

                    {posts.length === 10 && <button className='pag-btn' onClick={onClickNext}>Next</button>}
                </div>

            </Layout>

        </div>
    )
}