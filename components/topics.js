import Topic from './topic'
import postStyles from '../styles/post.module.css'


const Topics = ({ topics }) => {

    return (
        <div >
            {topics.map((topic) => (
                <Topic key={topic._id} topic={topic} />
            ))}
        </div>
    )
}

export default Topics
