import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../../actions/auth'
import PropTypes from 'prop-types'


const Login = ({ login, isAuthenticated }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const emailchangeHandler = (e) => {
        setEmail(e.target.value)
    }
    const passwordchangeHandler = (e) => {
        setPassword(e.target.value)
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        login({ email, password })

    }
    if (isAuthenticated) {
        return <Navigate to='/dashboard' replace={true} />
    }

    return (
        <>

            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" onSubmit={submitHandler}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        onChange={emailchangeHandler}
                        required

                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={passwordchangeHandler}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p></>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login)