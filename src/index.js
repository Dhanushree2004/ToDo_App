// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Nav from './Nav';
import Signup from './Signup';
import Login from './Login';
import TodoList from './TodoList';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/todolist" element={<TodoList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
