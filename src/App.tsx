import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Header } from './Header';
import { Home } from './Home/Home';
import { SetUp } from './SetUp/SetUp';
import { Manage } from './Manage/Manage';

const App = () => {
  return (
    <div className="app">
      <Header></Header>
      <Routes>
        <Route path='/' element={<Navigate to="/setup" />}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/setup' element={<SetUp/>}></Route>
        <Route path='/manage' element={<Manage/>}></Route>
      </Routes>
    </div>
  )
}

export default App;
