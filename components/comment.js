import postStyles from '../styles/post.module.css'
import Comments from '../components/comments'
import Link from 'next/link'
import axios from 'axios'
import { useSession } from 'next-auth/client'
import { useState, useEffect } from 'react'
import moment from 'moment'

const Comment = ({ comment: commentProp }) => {
    const [session, loading] = useSession({})
    const [replies, setReplies] = useState([])
    const [comment, setComment] = useState(commentProp)
    const [replyBody, setReplyBody] = useState('')
    const [showReplies, setShowReplies] = useState(false)
    const [userHasLikedComment, setUserHasLikedComment] = useState(false)


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

    return (
        <div className={postStyles.card}>

            <div>
                <Link href={`/users/${comment.userId}`}>{comment.createdBy}</Link>
                <h4>{moment(comment.createdAt).fromNow()}</h4>
            </div>
            <p>{comment.body}</p>
            <br />
            <span>{comment.likedBy ? Object.keys(comment.likedBy).length : 0}</span>
            <button onClick={onLike}>{userHasLikedComment ? '♥' : '♡'}</button>

            <button onClick={toggleShowReplies}>{replies.length} replies</button>
            <div>
                {session && <>
                    <form onSubmit={saveReply}>
                        <input id='body' name='body' value={replyBody} onChange={onReplyBodyChange} type="text" placeholder='add a reply' required />
                        <br></br>
                        <button type="submit"> Add reply </button>
                    </form>
                </>}
            </div>
            {showReplies &&
                <Comments comments={replies} />
            }

        </div>
    )
}

export default Comment
