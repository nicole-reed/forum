import Topic from './topic'
import postStyles from '../styles/post.module.css'


const LikedTopics = ({ topics }) => {

    return (
        <div >
            {topics.map((topic) => (
                <Topic key={topic._id} topic={topic} />
            ))}
        </div>
    )
}

export default LikedTopics
