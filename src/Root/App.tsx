import '../assets/css/border.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Header } from './Header';
import { Home } from '../Home/Home';
import { Manage } from '../Manage/Manage';
import { Schedule } from '../SetUp/Schedule';
import { Automation } from '../SetUp/Automation';
import { BackRoom } from '../SetUp/BackRoom';

const App = () => {
  return (
    <div className="app">
      <Header></Header>
      <Routes>
        <Route path='/' element={<Navigate to="/home" />}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/setup' element={<Navigate to="/setup/schedule" />}></Route>
        <Route path='/setup/schedule' element={<Schedule/>}></Route>
        <Route path='/setup/backroom' element={<BackRoom/>}></Route>
        <Route path='/setup/automation' element={<Automation/>}></Route>
        <Route path='/manage' element={<Manage/>}></Route>
      </Routes>
    </div>
  )
}

export default App;
