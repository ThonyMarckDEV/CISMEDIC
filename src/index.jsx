import React from 'react';
import ReactDOM from 'react-dom'; // Importación normal
import App from './App';
import 'animate.css';

// Con React 17 usa render() en lugar de createRoot()
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
