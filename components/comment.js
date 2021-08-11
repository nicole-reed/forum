import postStyles from '../styles/post.module.css'
import Comments from '../components/comments'
import axios from 'axios'
import { useSession } from 'next-auth/client'
import { useState } from 'react'

const Comment = ({ comment }) => {
    const [session, loading] = useSession({})
    const [replies, setReplies] = useState([])

    const getReplies = async () => {
        try {
            const res = await axios.get(`/api/comments/${comment._id}/replies`)
            console.log('res', res)

            setReplies(res.data.replies)
        } catch (error) {
            console.log('error getting replies', error)
        }
    }

    const hideReplies = async () => {
        setReplies([])
    }

    const saveReply = async event => {
        try {
            // event.preventDefault()
            const res = await axios.post(`/api/posts/${comment.postId}/comments`, { body: event.target.body.value, replyTo: comment._id })

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className={postStyles.card}>
            <p>{comment.createdBy}</p>
            <p>{comment.body}</p>
            <br />
            <button onClick={getReplies}>{comment.replyCount} replies</button>
            <button onClick={hideReplies}>hide replies</button>
            <div>
                {session && <>
                    <form onSubmit={saveReply}>
                        <input id='body' name='body' type="text" placeholder='add a reply' required />
                        <br></br>
                        <button type="submit"> Add reply </button>
                    </form>
                </>}
            </div>
            <Comments comments={replies} />
        </div>
    )
}

export default Comment
