import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css'; // Comment dòng này vì dự án không có file index.css

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);