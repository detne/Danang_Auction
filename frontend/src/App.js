// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

const App = () => {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <UserProvider>
                <BrowserRouter>
                    <div className="App">
                        <Header />
                        <main className="main-content">
                            <AppRoutes />
                        </main>
                        <Footer />
                    </div>
                </BrowserRouter>
            </UserProvider>
        </GoogleOAuthProvider>
    );
};

export default App;