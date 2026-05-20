import axios from 'axios';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Segment } from "semantic-ui-react";
import "./App.css";
import Rotas from "./Rotas";

// === AXIOS INTERCEPTOR: Anexa o Token JWT na IDA (Request) ===
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// ==============================================================

// === AXIOS INTERCEPTOR: Trata o erro 403 na VOLTA (Response) ===
axios.interceptors.response.use(
  (response) => {
    // Se a requisição deu certo, a vida segue normalmente
    return response;
  },
  (error) => {
    // Se o Back-end bater a porta (Erro 403 - Token Expirado/Inválido)
    if (error.response && error.response.status === 403) {
      console.warn("Sessão expirada. O usuário será redirecionado.");
      
      // Limpa o crachá velho do cofre
      localStorage.removeItem("token");
      
      // Chuta o usuário gentilmente de volta para a tela de Login
      window.location.href = '/'; 
    }
    
    // Repassa o erro para o catch() de onde a requisição foi feita para não quebrar a Promise
    return Promise.reject(error);
  }
);
// ===============================================================

function App() {
  return (
    <div className="App">
      <ToastContainer />

      <Rotas />

      <div style={{ marginTop: "6%" }}>
        <Segment vertical color="grey" size="tiny" textAlign="center">
          &copy; 2026 - Projeto WEB IV - IFPE Jaboatão dos Guararapes
        </Segment>
      </div>
    </div>
  );
}

export default App;