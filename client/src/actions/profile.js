import axios from '../utils/axios'
import { setAlert } from './alert'
import { CLEAR_PROFILE, DELETE_ACCOUNT, GET_PROFILE, GET_PROFILES, GET_REPOS, PROFILE_ERROR, UPDATE_PROFILE } from './types'

export const getCurrentProfile = () => async (dispatch) => {
    dispatch({ type: CLEAR_PROFILE })
    try {
        const res = await axios({
            method: 'get',
            url: 'profile/me'
        })
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        })
    }
}

export const createProfile = (formData, navigate, edit = false) => async (dispatch) => {

    try {
        const res = await axios({
            method: 'post',
            url: '/profile/create',
            data: formData
        })

        dispatch({ type: GET_PROFILE, payload: res.data })
        dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"))

        if (!edit) navigate('/dashboard')
    } catch (err) {

        const errors = err.response.data.errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const addExperience = (formData, navigate) => async (dispatch) => {

    try {
        const res = await axios({
            method: 'put',
            url: '/profile/experience',
            data: formData
        })

        dispatch({ type: UPDATE_PROFILE, payload: res.data })
        dispatch(setAlert("Experience Added", "success"))

        navigate('/dashboard')
    } catch (err) {

        const errors = err.response.data.errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const addEducation = (formData, navigate) => async (dispatch) => {
    try {
        const res = await axios({
            method: 'put',
            url: '/profile/education',
            data: formData
        })

        dispatch({ type: UPDATE_PROFILE, payload: res.data })
        dispatch(setAlert("Education Added", "success"))

        navigate('/dashboard')
    } catch (err) {

        const errors = err.response.data.errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const deleteExperience = (id) => async (dispatch) => {

    try {
        const res = await axios({
            method: 'delete',
            url: `profile/experience/${id}`
        })

        dispatch({ type: UPDATE_PROFILE, payload: res.data })
        dispatch(setAlert("Experience deleted", "success"))
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText, status: error.response.status
            }
        })
    }

}

export const deleteEducation = (id) => async (dispatch) => {

    try {
        const res = await axios({
            method: 'delete',
            url: `profile/education/${id}`
        })

        dispatch({ type: UPDATE_PROFILE, payload: res.data })
        dispatch(setAlert("Education deleted", "success"))
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText, status: error.response.status
            }
        })
    }

}


export const deleteAccount = () => async (dispatch) => {

    if (window.confirm('Are you sure? This cannot be undone')) {
        try {
            await axios({
                method: 'delete',
                url: `/user/delete`
            })


            dispatch({ type: CLEAR_PROFILE })
            dispatch({ type: DELETE_ACCOUNT })
            dispatch(setAlert("Profile Deleted", "danger"))
        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText, status: error.response.status
                }
            })
        }
    }

}

export const getProfiles = () => async (dispatch) => {
    dispatch({ type: CLEAR_PROFILE })
    try {
        const res = await axios({
            method: 'get',
            url: '/profile/',

        })
        console.log(res)

        dispatch({ type: GET_PROFILES, payload: res.data.profiles })

    } catch (error) {
        console.log(error.response)

        dispatch(setAlert(error.response.data.message, "danger"))
        console.error(error.response.data);
    }
}

export const getProfileById = (userId) => async (dispatch) => {
    try {
        const res = await axios({
            method: 'get',
            url: `/profile/user/${userId}`,

        })

        dispatch({ type: GET_PROFILE, payload: res.data })

    } catch (error) {
        console.log(error.response)

        dispatch(setAlert(error.response.data.message, "danger"))
        console.error(error.response.data);
    }
}

export const getGithubRepos = (username) => async (dispatch) => {
    try {
        const res = await axios({
            method: 'get',
            url: `/profile/github/${username}`,

        })

        dispatch({ type: GET_REPOS, payload: res.data })

    } catch (error) {
        console.log(error.response)

        dispatch(setAlert(error.response.data.message, "danger"))
        console.error(error.response.data);
    }
}