import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CreatePage } from './pages/CreatePage';
import { LibraryPage } from './pages/LibraryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] to-[#0a0d12] text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;