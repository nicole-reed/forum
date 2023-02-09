import Comment from './comment'

const Comments = ({ comments, refreshComments }) => {

    return (
        <div className='comments'>
            {comments.map((comment) => (

                <Comment key={comment._id} comment={comment} refreshComments={refreshComments} />
            ))}
        </div>
    )
}

export default Comments
