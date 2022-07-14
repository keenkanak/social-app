import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import Alert from './components/layout/Alert'
import { Provider } from 'react-redux'
import reduxStore from './utils/reduxStore'
import setAuthToken from './utils/setAuthToken'
import Posts from './components/posts/Posts'
import PrivateRoute from './components/routing/PrivateRoute'
import { loadUser } from './actions/auth'
import CreateProfile from './components/profile-form/CreateProfile'
import './App.css'
import EditProfile from './components/profile-form/EditProfile'
import Profiles from './components/profiles/Profiles'
import Profile from './components/profile/Profile'
import AddExperience from './components/profile-form/AddExperience'
import AddEducation from './components/profile-form/AddEducation'
import Post from './components/post/Post'



if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    reduxStore.dispatch(loadUser())
  }, [])


  return (
    <Provider store={reduxStore}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path='/' element={<Landing />} />
          </Routes>
          <section className="container">
            <Alert />
            <Routes>
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='/profiles' element={<Profiles />} />
              <Route path='/profile/:id' element={<Profile />} />
              <Route path='/dashboard' element={<PrivateRoute>
                <Dashboard />
              </PrivateRoute>} />
              <Route path='/create-profile' element={<PrivateRoute>
                <CreateProfile />
              </PrivateRoute>} />
              <Route path='/edit-profile' element={<PrivateRoute>
                <EditProfile />
              </PrivateRoute>} />
              <Route path='/add-experience' element={<PrivateRoute>
                <AddExperience />
              </PrivateRoute>} />

              <Route path='/add-education' element={<PrivateRoute>
                <AddEducation />
              </PrivateRoute>} />
              <Route path='/posts' element={<PrivateRoute>
                <Posts />
              </PrivateRoute>} />
              <Route path='/posts/:id' element={<PrivateRoute>
                <Post/>
              </PrivateRoute>} />
            </Routes>
          </section>
        </>
      </Router>
    </Provider>

  )
}




export default App;