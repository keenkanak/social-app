import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { addExperience } from '../../actions/profile'

const AddExperience = ({ addExperience }) => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company: '',
        title: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: ''
    });

    const { company, title, location, from, to, current, description } = formData;

    const [toDateDisabled, setToDateDisabled] = useState(false)

    const changeHandler = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const submitHandler = e => {
        e.preventDefault()
        addExperience(formData, navigate)
    }
    return (
        <>
            <h1 className="large text-primary">
                Add An Experience
            </h1>
            <p className="lead">
                <i className="fas fa-code-branch"></i> Add any developer/programming
                positions that you have had in the past
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={submitHandler}>
                <div className="form-group">
                    <input type="text" placeholder="* Job Title" name="title" required value={title} onChange={changeHandler} />
                </div>
                <div className="form-group">
                    <input type="text" placeholder="* Company" name="company" required value={company} onChange={changeHandler} />
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Location" name="location" value={location} onChange={changeHandler} />
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input type="date" name="from" value={from} onChange={changeHandler} />
                </div>
                <div className="form-group">
                    <p><input type="checkbox" name="current" value={current} checked={current} onChange={(e) => {
                        setFormData({ ...formData, current: !current })
                        setToDateDisabled(!toDateDisabled)
                    }} />{' '}
                        Current Job
                    </p>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input type="date" name="to" value={to} onChange={changeHandler} disabled={toDateDisabled ? 'disabled' : ''} />
                </div>
                <div className="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Job Description"
                        value={description} onChange={changeHandler}
                    ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to='/dashboard'>Go Back</Link>
            </form>
        </>
    )
}

AddExperience.propTypes = {
    addExperience: PropTypes.func.isRequired
}

export default connect(null, { addExperience })(AddExperience)