import { Route, Routes } from "react-router-dom";

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

// Importações das novas telas de Pedido
import FormPedido from "./views/pedido/FormPedido";
import ListPedido from "./views/pedido/ListPedido";

function Rotas() {
  return (
    <>
      <Routes>
        {/* A porta de entrada do sistema agora é o Login */}
        <Route path="/" element={<Login />} />
        
        {/* A Home passa a ser uma rota interna */}
        <Route path="/home" element={<Home />} />
        
        {/* Restante das rotas do sistema */}
        <Route path="list-cliente" element={<ListCliente />} />
        <Route path="form-cliente" element={<FormCliente />} />
        <Route path="list-produto" element={<ListProduto />} />
        <Route path="form-produto" element={<FormProduto />} />
        <Route path="list-entregador" element={<ListEntregador />} />
        <Route path="form-entregador" element={<FormEntregador />} />
        <Route path="list-livros" element={<ListLivros />} />
        <Route path="form-livros" element={<FormLivros />} />
        <Route path="list-carro" element={<ListCarro />} />
        <Route path="form-carro" element={<FormCarro />} />
        <Route path="form-promocao" element={<FormPromocao />} />
        <Route path="list-promocao" element={<ListPromocao />} />
        <Route path="/list-categoria-produto" element={<ListCategoriaProduto />} />
        <Route path="/form-categoria-produto" element={<FormCategoriaProduto />} />
        
        {/* Novas rotas de Pedido */}
        <Route path="/form-pedido" element={<FormPedido />} />
        <Route path="/list-pedido" element={<ListPedido />} />
      </Routes>
    </>
  );
}

export default Rotas;