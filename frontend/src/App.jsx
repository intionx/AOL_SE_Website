
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import { Navigate } from 'react-router'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Forum from './pages/forum/Forum'
import ForumDetail from './pages/forum/ForumDetail'
import Dashboard from './pages/dashboard/Dashboard'
import KosDetail from './pages/dashboard/KosDetail'
import Profile from './pages/profile/Profile'
import EditProfile from './pages/profile/EditProfile'
import SubmitKos from './pages/submission/Submission'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/forum' element={<Forum />}/>
          <Route path='/forum/:id' element={<ForumDetail />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/kos/:id' element={<KosDetail />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/submit-kos' element={<SubmitKos />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
