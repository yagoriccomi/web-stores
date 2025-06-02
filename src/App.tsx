// src/App.tsx
// import LoginPage from './pages/LoginPage'; // Comentado para exibir SignUpPage
import SignUpPage from './pages/SignUpPage'; // Importa a nova página
import { AuthProvider } from './contexts/AuthContext'; //

function App() {
  return (
    <AuthProvider> {/* Envolve com AuthProvider se for usar autenticação depois */}
      {/* <LoginPage /> */}
      <SignUpPage /> {/* Renderiza a página de cadastro */}
    </AuthProvider>
  );
}

export default App;