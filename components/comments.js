import Comment from './comment'

const Comments = ({ comments }) => {

    return (
        <div >
            {comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
            ))}
        </div>
    )
}

export default Comments
