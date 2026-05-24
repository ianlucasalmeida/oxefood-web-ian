import { Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./views/util/ProtectedRoute";

import FormCarro from "./views/carro/FormCarro";
import ListCarro from "./views/carro/ListCarro";
import FormCliente from "./views/cliente/FormCliente";
import ListCliente from "./views/cliente/ListCliente";
import FormEntregador from "./views/entregador/FormEntregador";
import ListEntregador from "./views/entregador/ListEntregador";
import Home from "./views/home/Home";
import FormLivros from "./views/livros/FormLivros";
import ListLivros from "./views/livros/ListLivros";
import FormProduto from "./views/produto/FormProduto";
import ListProduto from "./views/produto/ListProduto";
import FormPromocao from "./views/promocao/FormPromocao";
import ListPromocao from "./views/promocao/ListPromocao";
import FormCategoriaProduto from "./views/categoriaProduto/FormCategoriaProduto";
import ListCategoriaProduto from "./views/categoriaProduto/ListCategoriaProduto";
import Login from './views/login/Login';
import FormFuncionario from "./views/funcionario/FormFuncionario";
import ListFuncionario from "./views/funcionario/ListFuncionario";
import FormPedido from "./views/pedido/FormPedido";
import ListPedido from "./views/pedido/ListPedido";

function Rotas() {
  return (
    <Routes>
      {/* Rota Pública */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Rotas Privadas (Protegidas) */}
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      
      <Route path="/list-cliente" element={<ProtectedRoute><ListCliente /></ProtectedRoute>} />
      <Route path="/form-cliente" element={<ProtectedRoute><FormCliente /></ProtectedRoute>} />
      
      <Route path="/list-produto" element={<ProtectedRoute><ListProduto /></ProtectedRoute>} />
      <Route path="/form-produto" element={<ProtectedRoute><FormProduto /></ProtectedRoute>} />
      
      <Route path="/list-entregador" element={<ProtectedRoute><ListEntregador /></ProtectedRoute>} />
      <Route path="/form-entregador" element={<ProtectedRoute><FormEntregador /></ProtectedRoute>} />
      
      <Route path="/list-livros" element={<ProtectedRoute><ListLivros /></ProtectedRoute>} />
      <Route path="/form-livros" element={<ProtectedRoute><FormLivros /></ProtectedRoute>} />
      
      <Route path="/list-carro" element={<ProtectedRoute><ListCarro /></ProtectedRoute>} />
      <Route path="/form-carro" element={<ProtectedRoute><FormCarro /></ProtectedRoute>} />
      
      <Route path="/list-promocao" element={<ProtectedRoute><ListPromocao /></ProtectedRoute>} />
      <Route path="/form-promocao" element={<ProtectedRoute><FormPromocao /></ProtectedRoute>} />
      
      <Route path="/list-categoria-produto" element={<ProtectedRoute><ListCategoriaProduto /></ProtectedRoute>} />
      <Route path="/form-categoria-produto" element={<ProtectedRoute><FormCategoriaProduto /></ProtectedRoute>} />
      
      <Route path="/list-funcionario" element={<ProtectedRoute><ListFuncionario /></ProtectedRoute>} />
      <Route path="/form-funcionario" element={<ProtectedRoute><FormFuncionario /></ProtectedRoute>} />
      
      <Route path="/list-pedido" element={<ProtectedRoute><ListPedido /></ProtectedRoute>} />
      <Route path="/form-pedido" element={<ProtectedRoute><FormPedido /></ProtectedRoute>} />
    </Routes>
  );
}

export default Rotas;