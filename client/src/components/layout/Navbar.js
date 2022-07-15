import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth'


const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
    console.log(user);
    let authLinks = null
    if (user !== null) {
        authLinks = (
            <ul>
                <li><Link to={`/profile/${user._id}`}>{user.username} {' '} </Link></li>
                <li><Link to="/profiles">People</Link></li>
                <li><Link to="/posts">Posts</Link></li>
                <li>
                    <Link to='/dashboard'>
                        <i className="fas fa-user" />{' '}
                        <span className='hide-sm'>Dashboard</span>
                    </Link>
                </li>
                <li><a onClick={logout} href='/login'>
                    <i className='fas fa-sign-out-alt'></i>{' '}
                    <span className='hide-sm'> Logout</span>
                </a></li>
            </ul >
        )
    }
    const guestLinks = (

        <ul>
            <li><Link to="/profiles">People</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    )
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to='/'><i className="fas fa-code" ></i> Social-App</Link>
            </h1>


            {!loading && <> {isAuthenticated && (user !== null) ? authLinks : guestLinks}</>}
        </nav>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar)