import Head from 'next/head'
import Layout from '../components/layout'
import Posts from '../components/posts'
import React from 'react'
import axios from 'axios'
import { useState } from 'react'

export default function Search() {
    const [posts, setPosts] = useState([])
    const [keyword, setKeyword] = useState('')
    const [pageNumber, setPageNumber] = useState(1)

    const onKeywordChange = (event) => {
        setKeyword(event.target.value)
    }

    const getPosts = async (pageNumber, event) => {
        try {
            event && event.preventDefault()
            const res = await axios.get(`/api/search`, { params: { page: pageNumber, keyword } })

            setPosts(res.data.posts)
        } catch (error) {
            console.log(error.message)
        }
    }


    const onClickNext = () => {
        try {
            const newPageNumber = pageNumber + 1
            getPosts(newPageNumber)
            setPageNumber(newPageNumber)
        } catch (error) {
            console.log(error.message)
        }
    }

    const onClickBack = () => {
        try {
            const newPageNumber = pageNumber - 1
            getPosts(newPageNumber)
            setPageNumber(newPageNumber)
        } catch (error) {
            console.log(error.message)
        }
    }

    const onSubmit = async (event) => {
        try {
            event.preventDefault()

            getPosts(pageNumber, event)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div >
            <Head>
                <title>Search</title>
            </Head>
            <Layout>
                <h2>Search Posts By Keywords</h2>
                <form onSubmit={onSubmit}>
                    <input className='search-input' id='keyword' name='keyword' type="text" placeholder='keyword' value={keyword} onChange={onKeywordChange} required />
                    <button type="submit"> 🔍 </button>
                </form>
                {posts.length > 0 ? <Posts posts={posts} /> : <p>No Posts Matching Keyword</p>}
                {pageNumber > 1 && <button className='pag-btn' onClick={onClickBack}>Back</button>}

                {posts.length === 10 && <button className='pag-btn' onClick={onClickNext}>Next</button>}

            </Layout>
        </div>
    )
}

