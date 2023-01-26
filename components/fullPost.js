import postStyles from '../styles/post.module.css'
import axios from 'axios'
import moment from 'moment'
import Comments from '../components/comments'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import BlackHeart from '../components/icons/BlackHeart'
import WhiteHeart from '../components/icons/WhiteHeart'
import CommentIcon from '../components/icons/Comment'
import Trash from '../components/icons/Trash'

const Post = ({ post: postProp }) => {
    const [session, loading] = useSession({})
    const [comments, setComments] = useState([])
    const [commentBody, setCommentBody] = useState('')
    const [showComments, setShowComments] = useState(true)
    const [post, setPost] = useState(postProp)
    const [userHasLikedPost, setUserHasLikedPost] = useState(false)
    const [image, setImage] = useState('')
    const { addToast } = useToasts()


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
    useEffect(async () => {
        if (post.image) {
            try {
                await axios.get(post.image)
                setImage(post.image)
            } catch (error) {
                setImage(post.fullImage)
            }
        }
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
        <div className='full-post'>

            <div className={postStyles.card}>
                <div>
                    <h1>{post.title}</h1>
                    <a href={`/users/${post.userId}`}>{post.createdBy}</a> {session && session.user.id === post.userId && <button onClick={() => deletePost()}><Trash width={12} height={12} /></button>}
                    <h4>{moment(post.createdAt).fromNow()}</h4>
                    <br></br>
                    <p className={postStyles.body}>{post.body}</p>
                    <br></br>
                    {post.image && <img src={image}></img>}
                    <br></br>
                    <span>{post.likedBy ? Object.keys(post.likedBy).length : 0}</span>
                    <button className='heart-btn' onClick={session ? onLike : () => addToast('Please Sign In to Like and Comment', { appearance: "info" })}>{userHasLikedPost ? <BlackHeart width={12} height={12} /> : <WhiteHeart width={12} height={12} />}</button>

                    {comments.length}<button onClick={toggleShowComments}><CommentIcon width={14} height={14} strokeWidth={2} /></button>
                    <br></br>
                    {session && <>
                        <form onSubmit={saveComment} >
                            <input className='comment-input' id='body' name='body' type="text" value={commentBody} onChange={onCommentBodyChange} placeholder='add a comment' required />
                            <br></br>
                            <button type="submit"> Add Comment </button>
                        </form>
                    </>}
                    {showComments &&

                        <Comments comments={comments} refreshComments={getComments} />
                    }
                </div>
            </div>
            {/* {!session && <p className='sign-in-link'><a href='/api/auth/signin'>Sign in</a> to like and comment!</p>} */}

        </div>

    )

}

export default Post
