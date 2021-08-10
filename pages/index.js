import Layout from '../components/layout'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Posts from '../components/posts'
import Head from 'next/head'
import axios from 'axios'

export default function Home() {

  const [posts, setPosts] = useState([])
  const [pageNumber, setPageNumber] = useState(1)


  const getPosts = async (page) => {
    try {
      const res = await axios.get('/api/posts', { params: { page } })

      setPosts(res.data.posts)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getPosts(pageNumber)
  }, [])

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


  return <div>
    <Head>
      <title>Home</title>
    </Head>
    <Layout />

    <div className="container">
      <main>
        <h1 className="title">
          Digital Nomad Forum
        </h1>

        <p className="description">
          A place for DN's by DN's
        </p>

        <div className="grid">



          <Posts posts={posts} setPosts={setPosts} />
          {pageNumber > 1 && <button onClick={onClickBack}>Back</button>}

          {posts.length === 10 && <button onClick={onClickNext}>Next</button>}

        </div>

      </main>
    </div>

    <footer>

    </footer>

  </div>
}
