import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import KeyGenerator from './components/Key_generator';
import Encrypter from './components/Encrypter';
import Decrypter from './components/Decrypter';

function App() {
  
  return (
    
    <Router>
      <Navbar />    
      <Routes>
          <Route path="/keygenerator" element={<KeyGenerator />}>            
          </Route>
          <Route path="/encrypter" element={<Encrypter />}>            
          </Route>
          <Route path="/decrypter" element={<Decrypter />}>            
          </Route>
        </Routes>
    </Router>
  );
}

export default App;
