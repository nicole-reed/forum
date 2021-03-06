import Head from 'next/head'
import Layout from '../components/layout'
import Posts from '../components/posts'
import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import SearchIcon from '../components/icons/Search'

export default function Search() {
    const [posts, setPosts] = useState([])
    const [keyword, setKeyword] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const [hasSearched, setHasSearched] = useState(false)

    const onKeywordChange = (event) => {
        setKeyword(event.target.value)
    }

    const getPosts = async (pageNumber, event) => {
        try {
            event && event.preventDefault()
            const res = await axios.get(`/api/search`, { params: { page: pageNumber, keyword } })

            setPosts(res.data.posts)
            setHasSearched(true)
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
                    <button type="submit"> <SearchIcon width={16} height={16} /> </button>
                </form>
                {hasSearched && posts.length < 1 ? <p>No Posts Matching Keyword</p> : <Posts posts={posts} />}

                {pageNumber > 1 && <button className='pag-btn' onClick={onClickBack}>Back</button>}

                {posts.length === 10 && <button className='pag-btn' onClick={onClickNext}>Next</button>}

            </Layout>
        </div>
    )
}

