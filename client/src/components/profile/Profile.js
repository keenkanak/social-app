import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProfileEducation from './ProfileEducation'
import ProfileExperience from './ProfileExperience'
import ProfileGithub from './ProfileGithub'
import { getProfileById } from '../../actions/profile'
import { Link } from 'react-router-dom'

const Profile = ({ getProfileById, profile: { profile, loading }, auth }) => {
    let path = window.location.pathname
    const id = path.slice(9)
    console.log(id);
    useEffect(() => {
        getProfileById(id)
    }, [getProfileById, id])
    return (
        <section className=' container'>
            {profile === null || loading ? <Spinner /> :
                (
                    <>
                        <Link to='/profiles' className='btn btn-light'>Back</Link>


                        {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && (<Link to='/edit-profile' className='btn btn-dark'>Edit Your Profile </Link>)}
                        <div className="profile-grid my-1">
                            <ProfileTop profile={profile} />
                            <ProfileAbout profile={profile} />
                            <div className="profile-exp bg-white p-2">
                                <h2 className="text-primary">Experience</h2>
                                {profile.experience.length > 0 ? (
                                    <>
                                        {profile.experience.map((experience) => (
                                            <ProfileExperience
                                                key={experience._id}
                                                experience={experience}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <h4>No experience credentials</h4>
                                )}
                            </div>

                            <div className="profile-edu bg-white p-2">
                                <h2 className="text-primary">Education</h2>
                                {profile.education.length > 0 ? (
                                    <>
                                        {profile.education.map((education) => (
                                            <ProfileEducation
                                                key={education._id}
                                                education={education}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <h4>No education credentials</h4>
                                )}
                            </div>

                            {profile.githubusername && (
                                <ProfileGithub username={profile.githubusername} />
                            )}
                        </div>


                    </>
                )
            }


        </section >
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getProfileById })(Profile)