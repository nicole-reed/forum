import postStyles from '../styles/post.module.css'


const Comment = ({ comment }) => {
    return (
        <div className={postStyles.card}>
            <p>{comment.body}</p>
            <br />
            <p>{comment.createdBy}</p>

        </div>
    )
}

export default Comment
