import axios from '../utils/axios'
import { setAlert } from './alert'
import { ADD_COMMENT, CREATE_POST, DELETE_POST, GET_POST, GET_POSTS, POST_ERROR, REMOVE_COMMENT, UPDATE_LIKES } from './types'

export const getPosts = () => async dispatch => {
    try {
        const res = await axios({
            method: 'get',
            url: '/post'
        })
        console.log(res.data.posts);
        dispatch({
            type: GET_POSTS,
            payload: res.data.posts
        })
    } catch (error) {
        console.log("error");
        console.log(error.response);
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.data.message, status: error.response.status }
        })
    }
}

export const likePost = (post_id) => async (dispatch) => {

    try {
        const res = await axios({
            method: 'put',
            url: `/post/like/${post_id}`
        })
        console.log(res.data.post);


        dispatch({
            type: UPDATE_LIKES,
            payload: { post_id, likes: res.data.post }
        })


    } catch (error) {

        console.log(error.response);
        dispatch(setAlert(error.response.data.msg, "danger"))
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.data.message, status: error.response.status }
        })

    }
}

export const deletePost = (post_id) => async (dispatch) => {
    if (window.confirm('Are you sure? This cannot be undone')) {

        try {
            const res = await axios({
                method: 'delete',
                url: `/post/${post_id}`
            })

            console.log(res.data);
            dispatch({
                type: DELETE_POST,
                payload: post_id
            })
            dispatch(setAlert("Post Deleted", "success"))


        }
        catch (error) {

            console.log(error.response);
            dispatch({
                type: POST_ERROR,
                payload: { msg: error.response.data.message, status: error.response.status }
            })

        }
    }
}
export const createPost = (formData) => async (dispatch) => {


    try {
        const res = await axios({
            method: 'post',
            url: '/post/create',
            data: formData
        })

        console.log(res.data);
        dispatch({
            type: CREATE_POST,
            payload: res.data.newPost
        })
        dispatch(setAlert("Post Created", "success"))


    }
    catch (error) {

        console.log(error.response);
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.data.message, status: error.response.status }
        })

    }
}

export const getPost = (post_id) => async dispatch => {
    try {
        const res = await axios({
            method: 'get',
            url: `/post/${post_id}`
        })
        console.log(res.data.post);
        dispatch({
            type: GET_POST,
            payload: res.data.post
        })

    } catch (error) {
        console.log("error");
        console.log(error.response);
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.data.message, status: error.response.status }
        })
    }
}

export const addComment = (post_id, formData) => async dispatch => {
    try {
        const res = await axios({
            method: 'post',
            url: `/post/comment/${post_id}`,
            data: formData
        })
        console.log(res.data.post);
        dispatch({
            type: ADD_COMMENT,
            payload: res.data.comments
        })
        dispatch(setAlert("Comment Added", "success"))

    } catch (error) {
        console.log("error");
        console.log(error.response);
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.data.message, status: error.response.status }
        })
    }
}
export const removeComment = (post_id, commentId) => async dispatch => {
    try {
        const res = await axios({
            method: 'delete',
            url: `/post/comment/${post_id}/${commentId}`
        })
        console.log(res.data.post);
        dispatch({
            type: REMOVE_COMMENT,
            payload: res.data.comments
        })
        dispatch(setAlert("Comment Removed", "success"))

    } catch (error) {
        console.log("error");
        console.log(error.response);
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.data.message, status: error.response.status }
        })
    }
}
