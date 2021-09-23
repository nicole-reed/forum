import { useSession } from 'next-auth/client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BlackHeart from '../components/icons/BlackHeart'
import WhiteHeart from '../components/icons/WhiteHeart'

const Topic = ({ topic: topicProp }) => {
    const [session, loading] = useSession()
    const [topic, setTopic] = useState(topicProp)
    const [userHasLikedTopic, setUserHasLikedTopic] = useState(false)


    const getTopic = async () => {
        try {
            const res = await axios.get(`/api/topics/${topic._id}`)

            setTopic(res.data.topic)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if (topic._id) {
            getTopic()
        }

        if (session) {
            setUserHasLikedTopic(topic.likedBy && topic.likedBy.hasOwnProperty(session.user.id))
        }
    }, [topic._id, session, topic])

    const onLike = async () => {
        try {
            await axios.patch(`/api/topics/${topic._id}`, { liked: !userHasLikedTopic })

            getTopic()
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <div className='topic'>
            <div className='topic-items'>
                <a href={`/topics/${topic._id}/posts`}>
                    <h1 className='topicTitle'>{topic.title}</h1>
                </a>
                {session && <button onClick={onLike}>{userHasLikedTopic ? <BlackHeart width={12} height={12} /> : <WhiteHeart width={12} height={12} />}</button>}

            </div>
        </div>
    )
}

export default Topic