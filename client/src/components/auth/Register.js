import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'

import { setAlert } from '../../actions/alert'
import PropTypes from 'prop-types'
import { register } from '../../actions/auth'

const Register = ({ setAlert, register, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
    })
    const { username, email, password, password2 } = formData

    const submitHandler = async (e) => {
        e.preventDefault()
        if (password !== password2) {
            // console.log("Passwords don't match")
            setAlert("Passwords do not match", "danger")
        } else {
            //Auth Action
            register({ username, email, password })

        }
    }

    const changeHandler = (e) => {
        const val = e.target.value
        setFormData((prevData) => {
            return { ...formData, [e.target.name]: val }
        })
        // console.log(val)
    }

    if (isAuthenticated) {
        return <Navigate to='/dashboard' replace={true} />
    }

    return (
        <>
            <h1 className='large text-primary'>Sign Up</h1>
            <p className='lead'>
                <i className='fas fa-user'></i> Create Your Account
            </p>
            <form className='form' onSubmit={submitHandler}>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='Name'
                        name='username'
                        onChange={changeHandler}
                        value={username}

                    />
                </div>
                <div className='form-group'>
                    <input
                        type='email'
                        placeholder='Email Address'
                        name='email'
                        value={email}
                        onChange={changeHandler}

                    />
                    <small className='form-text'>
                        This site uses Gravatar so if you want a profile image, use a
                        Gravatar email{' '}
                    </small>
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder='Password'
                        name='password'
                        minLength='6'
                        value={password}
                        onChange={changeHandler}

                    />
                </div>
                <div className='form-group'>
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        name='password2'
                        minLength='6'
                        value={password2}
                        onChange={changeHandler}

                    />
                </div>
                <input
                    type='submit'
                    className='btn btn-primary'
                    value='Register'
                />
            </form>
            <p className='my-1'>
                Already have an account? <Link to='/login'>Sign In</Link>
            </p>
        </>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps, { setAlert, register })(Register)
