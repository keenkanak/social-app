import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { likePost, deletePost } from '../../actions/post'

const PostItem = ({ auth, post: { _id, text, name, avatar, user, likes, comments, date }, likePost, deletePost, showActions }) => {
    return (
        <div className="post bg-white p-1 my-1">
            <div>
                <Link to={`/profile/${user}`}>
                    <img
                        className="round-img"
                        src={avatar}
                        alt=""
                    />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p className="my-1">
                    {text}
                </p>
                <p className="post-date">
                    Posted on <Moment format="DD/MM/YYYY">{date}</Moment>
                </p>
                {showActions && <>
                    <button type="button" onClick={() => likePost(_id)} className="btn btn-light">
                        <i className="fas fa-thumbs-up"></i> {' '}
                        <span>{likes.length}</span>
                    </button>
                    <button type="button" className="btn btn-light">
                        <i className="fas fa-thumbs-down"></i>
                    </button>
                    <Link to={`/posts/${_id} `} className="btn btn-primary">
                        Discussion  {' '}<span className='comment-count'>{comments.length}</span>
                    </Link>
                    {!auth.loading && user === auth.user._id && (
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => deletePost(_id)}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}</>}



            </div>
        </div >
    )
}

PostItem.defaultProps = {
    showActions: true
}

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    likePost: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { likePost, deletePost })(PostItem)