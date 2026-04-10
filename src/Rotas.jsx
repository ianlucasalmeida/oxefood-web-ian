import { Route, Routes } from "react-router-dom";

import FormCarro from "./views/carro/FormCarro";
import ListCarro from "./views/carro/ListCarro";
import FormCliente from './views/cliente/FormCliente';
import ListCliente from './views/cliente/ListCliente';
import FormEntregador from './views/entregador/FormEntregador';
import ListEntregador from './views/entregador/ListEntregador';
import Home from './views/home/Home';
import FormLivros from './views/livros/FormLivros';
import ListLivros from './views/livros/ListLivros';
import FormProduto from './views/produto/FormProduto';
import ListProduto from './views/produto/ListProduto';
import FormPromocao from "./views/promocao/FormPromocao";
import ListPromocao from "./views/promocao/ListPromocao";

function Rotas() {
    return (
        <>
            <Routes>
                <Route path="/" element={ <Home/> } />
                <Route path="list-cliente" element={ <ListCliente/> } />
                <Route path="form-cliente" element={ <FormCliente/> } />
                <Route path="list-produto" element={ <ListProduto/> } />
                <Route path="form-produto" element={ <FormProduto/> } />
                <Route path="list-entregador" element={ <ListEntregador/> } />
                <Route path="form-entregador" element={ <FormEntregador/> } />
                <Route path="list-livros" element={ <ListLivros/> } />
                <Route path="form-livros" element={ <FormLivros/> } />
                <Route path="list-carro" element={ <ListCarro/> } />
                <Route path="form-carro" element={ <FormCarro/> } />
                <Route path="form-promocao" element={<FormPromocao/>}/>
                <Route path="list-promocao" element={<ListPromocao/>}/>
            </Routes>
        </>
    )
}

export default Rotas
