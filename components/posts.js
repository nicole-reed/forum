import Post from './post'

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
