import axios from '../utils/axios'
import setAuthToken from '../utils/setAuthToken';
import { setAlert } from './alert';
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE } from './types'

//Register User
export const register = ({ username, email, password }) => async (dispatch) => {
    const userRegisterPayload = { username, email, password }
    try {
        const res = await axios({
            method: 'post',
            url: '/user/register',
            data: userRegisterPayload
        });
        
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
        dispatch(setAlert(res.data.message, "success"))

        dispatch(loadUser())

    } catch (error) {
        const errors = error.response.data.errors

        if (errors) {
            console.log("Errors found " + errors)
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")))
        }

        dispatch({
            type: REGISTER_FAIL
        })
        console.error(error.response.data);
    }
}

//Load User
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }

    try {
        const res = await axios({
            method: 'get',
            url: '/auth'
        })

        dispatch({
            type: USER_LOADED,
            payload: res.data
        })

    } catch (error) {
        dispatch({ type: AUTH_ERROR })
    }
}

//Login User
export const login = ({ email, password }) => async (dispatch) => {
    const userLoginPayload = { email, password }
    try {
        const res = await axios({
            method: 'post',
            url: '/auth/login',
            data: userLoginPayload
        });

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })

        dispatch(setAlert(res.data.message, "success"))

        dispatch(loadUser())
    } catch (error) {

        console.log(error.response)

        dispatch(setAlert(error.response.data.message, "danger"))


        dispatch({
            type: LOGIN_FAIL
        })
        console.error(error.response.data);
    }
}

//Logout/Clear Profiles

export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE })
    dispatch({ type: LOGOUT })


}