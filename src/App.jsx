import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Login from "./components/pages/authenticationPage/login"
import Registration from "./components/pages/authenticationPage/registration"
import Profile from './components/profile'
import Teacher from './components/pages/teacherPage/teacherProfile'
import Admin from './components/pages/adminPage/adminProfile'
import User from './components/userProfile'
import AdminManagement from './components/pages/adminPage/adminManagement' 
import LevelManagement from './components/pages/adminPage/levelManagement'
import GroupManagement from './components/pages/adminPage/groupManagement'
import CreateGroup from './components/pages/adminPage/createGroup'
import UserGroups from './components/userGroups'
import MyGroup from './components/pages/personalRoom/myGroup'
import TeacherManagement from './components/pages/teacherPage/teacherManagement'
import CreateLesson from './components/pages/adminPage/createLesson'
import GroupDetails from './components/pages/teacherPage/groupDetails'
import EditLesson from './components/pages/teacherPage/editLesson'
import Index from './components/pages/mainPage/index'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Index/>}/>
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
