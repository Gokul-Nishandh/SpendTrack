// App.js
import './App.css';
import Home from './Home';
import { Route, Routes, Navigate } from 'react-router-dom';
import TitleBar from './TitleBar';
import MenuBar from './MenuBar';
import Profile from './Profile';
import Login from './Login';
import AddExpense from "./AddExpense.js";
import TrackExpense from './TrackExpense.js';
import SetBudget from './SetBudget.js';
import { useState } from 'react';
import AddFriends from './AddFriends.js';
import ViewGroups from './ViewGroups.js';
import Recents from './Recents.js';
import ViewProfile from './ViewProfile.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,setUserName]=useState("");
  const [userId,setUserId]=useState();
  const [total,setTotal]=useState();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <TitleBar isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/menubar" element={isLoggedIn ? <MenuBar /> : <Navigate to="/login" />} />
        <Route path="/menubar/recents" element={<Recents userId={userId} />} />
        <Route path="/profilebar" element={isLoggedIn ? <Profile userId={userId} userName={userName} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/profile/view-profile" element={<ViewProfile userId={userId} />} />
        <Route path="/login" element={<Login userId={userId} setUserId={setUserId} userName={userName} setUserName={setUserName} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/addexpense" element={<AddExpense userId={userId}/>} />
        <Route path="/trackexpenses" element={<TrackExpense userId={userId} total={total} setTotal={setTotal} />} />
        <Route path="/setbudget" element={<SetBudget userId={userId} total={total}/>} />
        <Route path="/menubar/addnewfriends" element={<AddFriends userId={userId}/>} />
        <Route path="/viewgroups" element={<ViewGroups userId={userId}/>} /> 
      </Routes>
    </div>
  );
}

export default App;