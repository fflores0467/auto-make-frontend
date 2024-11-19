import '../assets/css/border.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Header } from './Header';
import { Home } from '../Home/Home';
import { Manage } from '../Manage/Manage';
import { Job } from '../SetUp/Job';
import { Automation } from '../SetUp/Automation';
import { Review } from '../SetUp/Review';
import { Confirmation } from '../SetUp/Confirmation';
import { BackRoom } from '../SetUp/BackRoom';
import { Notification } from '../Notification/Notification';

const App = () => {
  return (
    <div className="app">
      <Header></Header>
      <Routes>
        <Route path='/' element={<Navigate to="/home" />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/setup' element={<Navigate to="/setup/schedule" />}></Route>
        <Route path='/setup/schedule' element={<Job />}></Route>
        <Route path='/setup/backroom' element={<BackRoom />}></Route>
        <Route path='/setup/automation' element={<Automation />}></Route>
        <Route path='/setup/review' element={<Review />}></Route>
        <Route path='/setup/confirmation' element={<Confirmation />}></Route>
        <Route path='/manage' element={<Manage />}></Route>
        <Route path='/notification' element={<Notification />}></Route>
      </Routes>
    </div>
  )
}

export default App;
