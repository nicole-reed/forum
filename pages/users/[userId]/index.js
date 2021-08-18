import Head from 'next/head'
import Posts from '../../../components/posts'
import Layout from '../../../components/layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function PostsByUserId() {
    const router = useRouter()
    const { userId } = router.query
    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])
    const [pageNumber, setPageNumber] = useState(1)

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
            const user = await getUser(id)

            setUser(user)
        } catch (error) {
            console.log(error.message)
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
            getAndSetPosts(userId, pageNumber)
            setPageNumber(newPageNumber)
        } catch (error) {
            console.log(error.message)
        }
    }

    const onClickBack = async () => {
        try {
            const newPageNumber = pageNumber - 1
            getAndSetPosts(userId, pageNumber)
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
            <Layout />

            <main>
                {user ?
                    <h2>Posts by {user.name}</h2> :
                    <>
                        <h2>User Does Not Exist</h2>
                        <p>The link may be broken, or the page may have been removed.
                        Check to see if the link you're trying to open is correct.
                        </p>
                    </>
                }

                <Posts posts={posts} setPosts={setPosts} />
                {pageNumber > 1 && <button onClick={onClickBack}>Back</button>}

                {posts.length === 10 && <button onClick={onClickNext}>Next</button>}

            </main>
        </div>
    )
}