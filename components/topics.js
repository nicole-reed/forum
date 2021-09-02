import Topic from './topic'

const Topics = ({ topics }) => {

    return (
        <div className='topicContainer'>
            {topics.map((topic) => (
                <Topic key={topic._id} topic={topic} />
            ))}
        </div>
    )
}

export default Topics
