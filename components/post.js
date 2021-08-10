import postStyles from '../styles/post.module.css'


const Post = ({ post }) => {
    return (
        <div className={postStyles.card}>
            <a href={`/posts/${post._id}`}>
                <h3>{post.title}</h3>
            </a>
            <p>{post.body}</p>
            <p>by {post.createdBy}</p>

        </div>
    )
}

export default Post

//gotta figure out how to access the user by the user id and display the name 
//and then figure out how to display the date in a less crazy looking way