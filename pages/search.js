import Head from 'next/head'
import Layout from '../components/layout'
import Posts from '../components/posts'
import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function Topic() {
    const [posts, setPosts] = useState([])
    const [keyword, setKeyword] = useState('')

    const onKeywordChange = (event) => {
        setKeyword(event.target.value)
    }

    const getPosts = async event => {
        try {
            event.preventDefault()
            const res = await axios.get(`/api/search`, { params: { keyword } })

            setPosts(res.data.posts)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getPosts()
    }, [])

    return (
        <div >
            <Head>
                <title>Search</title>
            </Head>
            <Layout>
                <form onSubmit={getPosts}>
                    {/* <label htmlFor="name">Search: </label> */}
                    <input id='keyword' name='keyword' type="text" placeholder='keyword' value={keyword} onChange={onKeywordChange} required />
                    <button type="submit"> Search </button>
                </form>
                {posts.length > 0 ? <Posts posts={posts} /> : <h2>No Posts Matching Keyword</h2>}
            </Layout>
        </div>
    )
}

