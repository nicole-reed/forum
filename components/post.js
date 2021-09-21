import postStyles from '../styles/post.module.css'
import moment from 'moment'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const Post = ({ post }) => {
    const router = useRouter()
    const [topic, setTopic] = useState({})
    const [isloading, setLoading] = useState(true)
    const [image, setImage] = useState('')

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
    useEffect(async () => {
        if (post.image) {
            try {
                await axios.get(post.image)

                setImage(post.image)
            } catch (error) {
                setImage(post.fullImage)
            }
        }
        getTopic()
    }, [])

    return (
        <div className={postStyles.card}>
            {isloading ? '' :
                <>
                    <a href={`/posts/${post._id}`}>
                        {router.pathname == "/" ? <h3>{topic.title} : {post.title} </h3> : <h3>{post.title}</h3>}
                        <p>{post.body.slice(0, 175)}...</p>{post.image && <img className='small-img' src={image}></img>}

                        <h4>{moment(post.createdAt).fromNow()}</h4>
                    </a>
                </>
            }
        </div>
    )
}

export default Post
