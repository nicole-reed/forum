import Post from './post'
import postStyles from '../styles/post.module.css'


const Posts = ({ posts }) => {

    return (
        <div >
            {posts.map((post) => (
                <Post key={post._id} post={post} />
            ))}
        </div>
    )
}

export default Posts
