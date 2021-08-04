import postStyles from '../styles/post.module.css'

const Topic = ({ topic }) => {

    return (
        <div className={postStyles.card}>
            <h1>{topic.title}</h1>

            <p>{topic.description}</p>

        </div>
    )
}

export default Topic