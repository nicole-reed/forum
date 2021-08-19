import postStyles from '../styles/post.module.css'
import moment from 'moment'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Post = ({ post }) => {
    const [topic, setTopic] = useState({})
    const [loading, setLoading] = useState(true)

    const getTopic = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/topics/${post.topicId}`)

            setTopic(res.data.topic)
            setLoading(false)
        } catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getTopic()
    }, [])

    return (
        <div className={postStyles.card}>
            {loading ? '' :
                <>
                    <a href={`/posts/${post._id}`}>
                        <h3>{topic.title}: {post.title}</h3>
                    </a>
                    <p>{post.body.slice(0, 175)}...</p>
                    <br></br>
                    <p>{post.createdBy}</p>
                    <h4>{moment(post.createdAt).fromNow()}</h4>
                </>
            }
        </div>
    )
}

export default Post
