import postStyles from '../styles/post.module.css'
import axios from 'axios'
import moment from 'moment'
import Comments from '../components/comments'
import { useSession } from 'next-auth/client'
import { useState, useEffect } from 'react'

const Post = ({ post }) => {
    const [session, loading] = useSession({})
    const [comments, setComments] = useState([])
    const [commentBody, setCommentBody] = useState('')

    const onCommentBodyChange = (event) => {
        setCommentBody(event.target.value)
    }

    const getComments = async () => {
        try {
            const res = await axios.get(`/api/posts/${post._id}/comments`)

            setComments(res.data.comments)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        if (post._id) {
            getComments()
        }
    }, [post._id])


    const saveComment = async event => {
        try {
            event.preventDefault()
            const res = await axios.post(`/api/posts/${post._id}/comments`, { body: commentBody })

            getComments()
            setCommentBody('')
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div>
            <div className={postStyles.card}>
                <h1>{post.title}</h1>
                <h4>{post.createdBy} {moment(post.createdAt).fromNow()}</h4>
                <br></br>
                <p className={postStyles.body}>{post.body}</p>
                <br></br>
                {session && <>
                    <p>Add A Comment</p>
                    <form onSubmit={saveComment} >
                        <input id='body' name='body' type="text" value={commentBody} onChange={onCommentBodyChange} placeholder='body' required />
                        <br></br>
                        <button type="submit"> Add Comment </button>
                    </form>
                </>}
            </div>
            <Comments comments={comments}></Comments>
        </div>
    )

}

export default Post
