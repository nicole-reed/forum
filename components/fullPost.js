import postStyles from '../styles/post.module.css'
import axios from 'axios'
import moment from 'moment'
import Comments from '../components/comments'
import { useSession } from 'next-auth/client'
import { useState, useEffect } from 'react'

const Post = ({ post: postProp }) => {
    const [session, loading] = useSession({})
    const [comments, setComments] = useState([])
    const [commentBody, setCommentBody] = useState('')
    const [showComments, setShowComments] = useState(true)
    const [post, setPost] = useState(postProp)
    const [userHasLikedPost, setUserHasLikedPost] = useState(false)

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
        if (session) {
            setUserHasLikedPost(post.likedBy && post.likedBy.hasOwnProperty(session.user.id))
        }
    }, [post._id, session, post])

    const getPost = async () => {
        try {
            const res = await axios.get(`/api/posts/${post._id}`)

            setPost(res.data.post)
        } catch (error) {
            console.log(error.message)
        }
    }

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

    const onLike = async () => {
        try {

            await axios.patch(`/api/posts/${post._id}`, { liked: !userHasLikedPost })

            getPost()

        } catch (error) {
            console.log(error.message)
        }
    }


    const toggleShowComments = () => {
        setShowComments(!showComments)
    }

    const deletePost = async () => {
        try {
            await axios.delete(`/api/posts/${post._id}`)

            window.location.href = '/'
        } catch (error) {
            console.log(error.message)
        }
    }


    return (
        <div className={postStyles.card}>
            <div>
                <h1>{post.title}</h1>
                <a href={`/users/${post.userId}`}>{post.createdBy}</a> {session && session.user.id === post.userId && <button onClick={() => deletePost()}>🗑</button>}
                <h4>{moment(post.createdAt).fromNow()}</h4>
                <br></br>
                <p className={postStyles.body}>{post.body}</p>
                <br></br>

                <span>{post.likedBy ? Object.keys(post.likedBy).length : 0}</span>
                <button onClick={onLike}>{userHasLikedPost ? '♥' : '♡'}</button>

                {comments.length}<button onClick={toggleShowComments}>💬</button>
                {session && <>
                    <form onSubmit={saveComment} >
                        <input id='body' name='body' type="text" value={commentBody} onChange={onCommentBodyChange} placeholder='add a comment' required />
                        <br></br>
                        <button type="submit"> Add Comment</button>
                    </form>
                </>}
                {showComments &&

                    <Comments comments={comments} refreshComments={getComments} />
                }
            </div>
        </div>
    )

}

export default Post
