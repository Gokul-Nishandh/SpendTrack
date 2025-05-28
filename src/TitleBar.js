// TitleBar.js
import React from 'react';
import { FaAlignJustify } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';

const TitleBar = ({ isLoggedIn }) => {
  return (
    <main className="titlebar">
      <Link to="/menubar"><div className="menubar"><FaAlignJustify /></div></Link>
      <Link to="/"><p className="title">SpendTrack</p></Link>
      <input className="searchbar" type="text" placeholder="  Search" />
      <Link to={isLoggedIn ? "/profilebar" : "/login"}>
        <div className="profile">
          <CgProfile />
        </div>
      </Link>
    </main>
  );
};

export default TitleBar;