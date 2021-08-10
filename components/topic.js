import postStyles from '../styles/post.module.css'


const Topic = ({ topic }) => {

    return (
        <div className={postStyles.card}>
            <a href={`/topics/${topic._id}/posts`}>
                <h1>{topic.title}</h1>
            </a>
            <p>{topic.description}</p>



        </div>
    )
}

export default Topic