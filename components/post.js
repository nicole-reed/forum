import postStyles from '../styles/post.module.css'
import moment from 'moment'

const Post = ({ post }) => {
    return (
        <div className={postStyles.card}>
            <a href={`/posts/${post._id}`}>
                <h3>{post.title}</h3>
            </a>
            <p>{post.body.slice(0, 175)}...</p>
            <br></br>
            <p>{post.createdBy}</p>
            <h4>{moment(post.createdAt).fromNow()}</h4>
        </div>
    )
}

export default Post
