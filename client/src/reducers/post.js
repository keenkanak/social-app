import {
    ADD_COMMENT,
    CREATE_POST,
    DELETE_POST,
    GET_POST,
    GET_POSTS,
    POST_ERROR,
    REMOVE_COMMENT,
    UPDATE_LIKES
} from '../actions/types'

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {}
}

const postReducer = (state = initialState, { type, payload }) => {
    switch (type) {

        case GET_POSTS:
            return {
                ...state,
                loading: false,
                posts: payload,
            }
        case GET_POST:
            return {
                ...state,
                post: payload,
                loading: false
            }
        case POST_ERROR:
            return {
                ...state,
                error: payload
            }
        case UPDATE_LIKES:
            return {
                ...state,
                posts: state.posts.map(post => post._id === payload.post_id ? {
                    ...post, likes: payload.likes
                } : post)
            }
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== payload),
                loading: false
            }
        case CREATE_POST:
            return {
                ...state,
                posts: [payload, ...state.posts],
                loading: false,
            }
        case ADD_COMMENT:
        case REMOVE_COMMENT:
            return {
                ...state,
                post: { ...state.post, comments: payload },
                loading: false

            }
        default: return state
    }

}



export default postReducer
