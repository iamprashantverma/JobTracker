import React from 'react';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>

        {!isAuthenticated && <li><a href="/signup">Sign Up</a></li>}
        {!isAuthenticated && <li><a href="/login">Log In</a></li>}
        {isAuthenticated && (
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
