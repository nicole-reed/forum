import Layout from '../components/layout'
import React, { useEffect, useState } from 'react'
import Toggle from 'react-toggle'
import { useSession } from 'next-auth/client'
import Posts from '../components/posts'
import Topics from '../components/topics'
import Head from 'next/head'
import "react-toggle/style.css"
import axios from 'axios'
import { BrowserView, MobileView } from 'react-device-detect'

export default function Home() {
  const [session, loading] = useSession()
  const [posts, setPosts] = useState([])
  const [showLikedTopicsOnly, setShowLikedTopicsOnly] = useState(true)
  const [pageNumber, setPageNumber] = useState(1)
  const [topics, setTopics] = useState([])

  const getTopics = async () => {
    try {
      const res = await axios.get('/api/topics')

      setTopics(res.data.topics)
    } catch (error) {
      console.log(error.message)
    }
  }

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
    getTopics()

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

      <div>

        <p className="description">
          A place for Digital Nomads by Digital Nomads
        </p>
        {session &&
          <div className='checkbox'>
            <Toggle type='checkbox' icons={false} checked={showLikedTopicsOnly} onChange={onShowLikedTopicsOnlyChanged} />
            {showLikedTopicsOnly ? <span>My Topics</span> : <span>All Topics</span>}
            <br></br>
          </div>
        }


        <BrowserView>
          <div className="grid">
            <Topics topics={topics} />
            <Posts posts={posts} setPosts={setPosts} />
          </div>
        </BrowserView>
        <MobileView>

          <Posts posts={posts} setPosts={setPosts} />

        </MobileView>

        <div className='pagination'>
          {pageNumber > 1 && <button onClick={onClickBack}>Back</button>}

          {posts.length === 10 && <button onClick={onClickNext}>Next</button>}
        </div>
      </div>
    </Layout >
  </div >
}
