import { AUTH_ERROR, DELETE_ACCOUNT, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT, REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED } from "../actions/types";

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

const authReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token)
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
        case DELETE_ACCOUNT:
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            }

        default: return state
    }
}

export default authReducer