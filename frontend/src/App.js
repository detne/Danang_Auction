import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AssetDetail from './components/AssetDetail';
import Header from './components/Header'; // Chỉ import một lần
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Header /> {/* Header chỉ xuất hiện ở đây */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/asset/:id" element={<AssetDetail />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;