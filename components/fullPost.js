import postStyles from '../styles/post.module.css'


const Post = ({ post }) => {
    return (
        <div className={postStyles.card}>
            <a href={`/posts/${post._id}`}>
                <h3>{post.title}</h3>
            </a>
            <p>{post.body}</p>
            <br></br>
            <p>{post.createdBy}</p>
        </div>
    )
}

export default Post
