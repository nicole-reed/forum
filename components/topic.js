
const Topic = ({ topic }) => {

    return (
        <div className='topic'>
            <a href={`/topics/${topic._id}/posts`}>
                <h1 className='topicTitle'>{topic.title}</h1>
            </a>
            {/* <p>{topic.description}</p> */}

        </div>
    )
}

export default Topic