import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Divider, Form, Icon } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';
import { notifyError, notifySuccess } from '../../views/util/Util';

export default function FormPedido () {

    // Estados para carregar as listas do banco de dados
    const [listaCliente, setListaCliente] = useState([]);
    const [listaEntregador, setListaEntregador] = useState([]);

    // Estados para capturar qual cliente e entregador foram selecionados
    const [idCliente, setIdCliente] = useState();
    const [idEntregador, setIdEntregador] = useState();

    const { state } = useLocation();
    const [idPedido, setIdPedido] = useState();

    // Busca os dados assim que a tela abre
    useEffect(() => {
        axios.get("http://localhost:8080/api/cliente")
        .then((response) => {
            setListaCliente(response.data);
        })

        axios.get("http://localhost:8080/api/entregador")
        .then((response) => {
            setListaEntregador(response.data);
        })
    }, []);

    function salvar() {
        let pedidoRequest = {
            idCliente: idCliente,
            idEntregador: idEntregador
        }
    
        axios.post("http://localhost:8080/api/pedido", pedidoRequest)
        .then((response) => {
            notifySuccess('Pedido base criado com sucesso!');
        })
        .catch((error) => {
            notifyError(error.response.data.message);
        });
    }

    return (
        <div>
            <MenuSistema tela={'pedido'} />
            <div style={{marginTop: '3%'}}>
                <Container textAlign='justified' >

                    <h2> 
                        <span style={{ color: "darkgray" }}> Pedido &nbsp;<Icon name="angle double right" size="small" /> </span> 
                        Cadastro
                    </h2>

                    <Divider />
                    <div style={{marginTop: '4%'}}>
                        <Form>
                            <Form.Group widths='equal'>
                                {/* Dropdown de Cliente */}
                                <Form.Select
                                    required
                                    fluid
                                    tabIndex='1'
                                    placeholder='Selecione o Cliente'
                                    label='Cliente'
                                    options={listaCliente.map((c) => ({ key: c.id, text: c.nome, value: c.id }))}
                                    value={idCliente}
                                    onChange={(e, { value }) => { setIdCliente(value) }}
                                />

                                {/* Dropdown de Entregador */}
                                <Form.Select
                                    fluid
                                    tabIndex='2'
                                    placeholder='Selecione o Entregador'
                                    label='Entregador'
                                    options={listaEntregador.map((e) => ({ key: e.id, text: e.nome, value: e.id }))}
                                    value={idEntregador}
                                    onChange={(e, { value }) => { setIdEntregador(value) }}
                                />
                            </Form.Group>
                        </Form>
                        
                        <div style={{marginTop: '4%'}}>
                            <Link to={"/list-pedido"}>
                                <Button type="button" inverted circular icon labelPosition='left' color='orange'>
                                    <Icon name='reply' />
                                    Voltar
                                </Button>
                            </Link>
                                
                            <Button inverted circular icon labelPosition='left' color='blue' floated='right' onClick={() => salvar()}>
                                <Icon name='save' />
                                Salvar Pedido
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}