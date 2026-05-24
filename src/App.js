import React from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Segment } from "semantic-ui-react";
import "./App.css";
import Rotas from "./Rotas";

// IMPORTAÇÃO EXIGIDA PELO PROFESSOR (Aula C24)
import { setupAxiosInterceptors } from './views/util/AuthenticationService';

function App() {
  
  // Executa os interceptadores do Axios toda vez que a aplicação é recarregada
  setupAxiosInterceptors();

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