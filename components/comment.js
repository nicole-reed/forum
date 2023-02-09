import postStyles from '../styles/post.module.css'
import Comments from '../components/comments'
import Link from 'next/link'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import moment from 'moment'
import { useToasts } from 'react-toast-notifications'
import BlackHeart from '../components/icons/BlackHeart'
import WhiteHeart from '../components/icons/WhiteHeart'
import CommentIcon from '../components/icons/Comment'
import Trash from '../components/icons/Trash'

const Comment = ({ comment: commentProp, refreshComments }) => {
    const { data: session } = useSession({})
    const [replies, setReplies] = useState([])
    const [comment, setComment] = useState(commentProp)
    const [replyBody, setReplyBody] = useState('')
    const [showReplies, setShowReplies] = useState(false)
    const [userHasLikedComment, setUserHasLikedComment] = useState(false)
    const { addToast } = useToasts()

    const onReplyBodyChange = (event) => {
        setReplyBody(event.target.value)
    }

    const getReplies = async () => {
        try {
            const res = await axios.get(`/api/comments/${comment._id}/replies`)

            setReplies(res.data.replies)
        } catch (error) {
            console.log('error getting replies', error)
        }
    }
    useEffect(() => {
        getReplies()
        if (session) {
            setUserHasLikedComment(comment.likedBy && comment.likedBy.hasOwnProperty(session.user.id))
        }
    }, [session, comment])

    const toggleShowReplies = () => {
        setShowReplies(!showReplies)
    }

    const getComment = async () => {
        try {
            const res = await axios.get(`/api/comments/${comment._id}`)

            setComment(res.data.comment)
        } catch (error) {
            console.log(error.message)
        }
    }

    const onLike = async () => {
        try {

            await axios.patch(`/api/comments/${comment._id}`, { liked: !userHasLikedComment })

            getComment()

        } catch (error) {
            console.log(error.message)
        }
    }


    const saveReply = async event => {
        try {
            event.preventDefault()
            const res = await axios.post(`/api/posts/${comment.postId}/comments`, { body: replyBody, replyTo: comment._id })

            getReplies()
            setReplyBody('')
        } catch (error) {
            console.log(error.message)
        }
    }

    const deleteComment = async () => {
        try {
            await axios.delete(`/api/comments/${comment._id}`)

            refreshComments()
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className={postStyles.card}>
            <div>
                <Link href={`/users/${comment.userId}`}>{comment.createdBy}</Link>  {session && session.user.id === comment.userId && <button onClick={() => deleteComment()}><Trash width={12} height={12} /></button>}
                <h4>{moment(comment.createdAt).fromNow()}</h4>
            </div>
            <p>{comment.body}</p>
            <div className='post-stats'>
                <div className='likes'>
                    <span>{comment.likedBy ? Object.keys(comment.likedBy).length : 0}</span>
                    <button onClick={session ? onLike : () => addToast('Please Sign In to Like and Comment', { appearance: "info" })}>{userHasLikedComment ? <BlackHeart width={12} height={12} /> : <WhiteHeart width={12} height={12} />}</button>

                </div>
                <div className='comments'>
                    <span>{replies.length}</span>
                    <button onClick={toggleShowReplies}> <CommentIcon width={14} height={14} /></button>

                </div>
            </div>
            <div>
                {session && <>
                    <form onSubmit={saveReply}>
                        <input className='comment-input' id='body' name='body' value={replyBody} onChange={onReplyBodyChange} type="text" placeholder='add a reply' required />
                        <br></br>
                        <button type="submit"> Add reply </button>
                    </form>
                </>}
            </div>
            {showReplies &&
                <Comments comments={replies} refreshComments={getReplies} />
            }

        </div>
    )
}

export default Comment
