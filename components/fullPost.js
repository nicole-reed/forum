import postStyles from '../styles/post.module.css'
import axios from 'axios'
import { useSession } from 'next-auth/client'
import { useState } from 'react'

const Post = ({ post }) => {
    const [session, loading] = useSession({})

    const saveComment = async event => {
        try {
            // event.preventDefault()
            const res = await axios.post(`/api/posts/${post._id}/comments`, { body: event.target.body.value })

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className={postStyles.card}>
            <a href={`/posts/${post._id}`}>
                <h3>{post.title}</h3>
                <p>{post.createdBy}</p>
            </a>
            <p>{post.body}</p>
            <br></br>
            {session && <>
                <p>Add A Comment</p>
                <form onSubmit={saveComment}>
                    <input id='body' name='body' type="text" placeholder='body' required />
                    <br></br>
                    <button type="submit"> Add Comment </button>
                </form>
            </>}
        </div>
    )
}

export default Post
