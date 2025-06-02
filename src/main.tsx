// src/main.tsx
import React from 'react'; // Adicione esta linha se não estiver presente
import ReactDOM from 'react-dom/client'; // Corrigido para ReactDOM
import App from './App.tsx';
import './index.css'; // Certifique-se que o CSS está sendo importado

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)