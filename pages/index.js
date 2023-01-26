import Layout from '../components/layout'
import React, { useEffect, useState } from 'react'
import Toggle from 'react-toggle'
import { useSession } from 'next-auth/react'
import Posts from '../components/posts'
import Topics from '../components/topics'
import Head from 'next/head'
import "react-toggle/style.css"
import axios from 'axios'
import { BrowserView, MobileView } from 'react-device-detect'

export default function Home() {
  const [session, loading] = useSession()
  const [posts, setPosts] = useState([])
  const [showLikedTopicsOnly, setShowLikedTopicsOnly] = useState(false)
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
    setPageNumber(1)
    setShowLikedTopicsOnly(event.target.checked)
  }

  return <div>
    <Head>
      <title>Home</title>
    </Head>
    <Layout>

      <br></br>
      <p className="description">A place for Digital Nomads by Digital Nomads</p>
      <br></br>
      {session &&
        <div className='checkbox'>

          {showLikedTopicsOnly ? <span className='checkbox-text'>My Topics</span> : <span className='checkbox-text'>All Topics</span>}
          <Toggle type='checkbox' icons={false} checked={showLikedTopicsOnly} onChange={onShowLikedTopicsOnlyChanged} />

          <br></br>
        </div>
      }


      <BrowserView>
        <div className="grid">
          <Topics topics={topics} />
          {showLikedTopicsOnly && posts.length < 1 && pageNumber === 1 ? <p className='like-topic-msg'>You haven't liked any topics yet. Like a topic to add it to your topics.</p> : <Posts posts={posts} setPosts={setPosts} />}
        </div>
      </BrowserView>

      <MobileView>
        {showLikedTopicsOnly && posts.length < 1 && pageNumber === 1 ? <p className='like-topic-msg'>You haven't liked any topics yet. Like a topic to add it to your topics.</p> : <Posts posts={posts} setPosts={setPosts} />}
      </MobileView>

      <div className='pagination'>
        {pageNumber > 1 && <button className='pag-btn' onClick={onClickBack}>Back</button>}

        {posts.length === 10 && <button className='pag-btn' onClick={onClickNext}>Next</button>}
      </div>

    </Layout >
  </div >
}
