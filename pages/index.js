import Layout from '../components/layout'
import React, { useEffect, useState } from 'react'
import Toggle from 'react-toggle'
import { useSession } from 'next-auth/client'
import Posts from '../components/posts'
import Head from 'next/head'
import "react-toggle/style.css"
import axios from 'axios'

export default function Home() {
  const [session, loading] = useSession()
  const [posts, setPosts] = useState([])
  const [showLikedTopicsOnly, setShowLikedTopicsOnly] = useState(true)
  const [pageNumber, setPageNumber] = useState(1)

  const getPosts = async (page, likedTopicsOnly) => {
    try {
      const res = await axios.get('/api/posts', { params: { page, likedTopicsOnly: likedTopicsOnly ? 'true' : 'false' } })

      setPosts(res.data.posts)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getPosts(pageNumber, showLikedTopicsOnly)

  }, [showLikedTopicsOnly])

  const onClickNext = () => {
    try {
      const newPageNumber = pageNumber + 1
      getPosts(newPageNumber, showLikedTopicsOnly)
      setPageNumber(newPageNumber)
    } catch (error) {
      console.log(error.message)
    }
  }

  const onClickBack = () => {
    try {
      const newPageNumber = pageNumber - 1
      getPosts(newPageNumber, showLikedTopicsOnly)
      setPageNumber(newPageNumber)
    } catch (error) {
      console.log(error.message)
    }
  }

  const onShowLikedTopicsOnlyChanged = event => {
    setShowLikedTopicsOnly(event.target.checked)
  }

  return <div>
    <Head>
      <title>Home</title>
    </Head>
    <Layout>

      <div className="container">

        <h1 className="title">
          Digital Nomad Forum
        </h1>

        <p className="description">
          A place for DN's by DN's
        </p>

        {session &&
          <div className='checkbox'>
            <Toggle type='checkbox' icons={false} checked={showLikedTopicsOnly} onChange={onShowLikedTopicsOnlyChanged} />
            <span>Filter By Liked Topics</span>
          </div>
        }


        <div className="grid">
          <Posts posts={posts} setPosts={setPosts} />
          {pageNumber > 1 && <button onClick={onClickBack}>Back</button>}

          {posts.length === 10 && <button onClick={onClickNext}>Next</button>}

        </div>
      </div>
    </Layout>
  </div>
}
