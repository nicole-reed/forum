import Layout from '../components/layout'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Posts from '../components/posts'
import Head from 'next/head'
import axios from 'axios'

export default function Home() {

  const [posts, setPosts] = useState([])

  const getPosts = async () => {
    try {
      const res = await axios.get('/api/posts')

      setPosts(res.data.posts)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getPosts()
  }, [])

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

          {/* <Link href="/profile">
            <a className="card">
              <h3>My Profile &rarr;</h3>
              <p>See all of your polls.</p>
            </a>
          </Link>

          <Link href='/create'>
            <a className="card">
              <h3>Create A Poll &rarr;</h3>
              <p>Click here to create a new poll.</p>
            </a>
          </Link> */}

        </div>

      </main>
    </div>

    <footer>

    </footer>

  </div>
}
