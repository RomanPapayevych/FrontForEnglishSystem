import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Login from "./components/login"
import Registration from "./components/registration"
import Profile from './components/profile'
import Teacher from './components/teacherProfile'
import Admin from './components/adminProfile'
import User from './components/userProfile'
import AdminManagement from './components/adminManagement' 
import LevelManagement from './components/levelManagement'
import GroupManagement from './components/groupManagement'
import CreateGroup from './components/createGroup'
import UserGroups from './components/userGroups'
import MyGroup from './components/myGroup'
import TeacherManagement from './components/teacherManagement'
import CreateLesson from './components/createLesson'
import GroupDetails from './components/groupDetails'
import EditLesson from './components/editLesson'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to="/login"/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/registration' element={<Registration/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/userProfile' element={<User/>}/>
          <Route path='/adminProfile' element={<Admin/>}/>
          <Route path='/teacherProfile' element={<Teacher/>}/>
          <Route path='/adminManagement' element={<AdminManagement/>}/>
          <Route path='/levelManagement' element={<LevelManagement/>}/>
          <Route path='/groupManagement' element={<GroupManagement/>}/>
          <Route path='/createGroup' element={<CreateGroup/>}/>
          <Route path='/userGroups' element={<UserGroups/>}/>
          <Route path='/myGroup' element={<MyGroup/>}/>
          <Route path='/teacherManagement' element={<TeacherManagement/>}/>
          <Route path='/GroupDetails' element={<GroupDetails/>}/>
          <Route path='/createLesson' element={<CreateLesson/>}/>
          <Route path='/editLesson' element={<EditLesson/>}/>
          <Route path='*' element={<div>NotFound</div>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
