import postStyles from '../styles/post.module.css'
import Comments from '../components/comments'
import axios from 'axios'
import { useSession } from 'next-auth/client'
import { useState, useEffect } from 'react'
import moment from 'moment'

const Comment = ({ comment }) => {
    const [session, loading] = useSession({})
    const [replies, setReplies] = useState([])
    const [replyBody, setReplyBody] = useState('')
    const [showReplies, setShowReplies] = useState(false)

    const onReplyBodyChange = (event) => {
        setReplyBody(event.target.value)
    }

    const getReplies = async () => {
        try {
            const res = await axios.get(`/api/comments/${comment._id}/replies`)
            console.log('res', res)

            setReplies(res.data.replies)
        } catch (error) {
            console.log('error getting replies', error)
        }
    }
    useEffect(() => {
        getReplies()
    }, [])

    const toggleShowReplies = () => {
        setShowReplies(!showReplies)
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
            <h4>{comment.createdBy} {moment(comment.createdAt).fromNow()}</h4>
            <p>{comment.body}</p>
            <br />
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
