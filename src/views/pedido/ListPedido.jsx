import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Divider, Icon, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function ListPedido () {

    const [lista, setLista] = useState([]);

    useEffect(() => {
        carregarLista();
    }, [])

    function carregarLista() {
        axios.get("http://localhost:8080/api/pedido")
        .then((response) => {
            setLista(response.data)
        })
    }

    function formatarData(dataParam) {
        if (dataParam === null || dataParam === '' || dataParam === undefined) {
            return ''
        }
        let arrayData = dataParam.split('-');
        return arrayData[2] + '/' + arrayData[1] + '/' + arrayData[0];
    }

    return(
        <div>
            <MenuSistema tela={'pedido'} />
            <div style={{marginTop: '3%'}}>

                <Container textAlign='justified' >

                    <h2> Pedido </h2>
                    <Divider />

                    <div style={{marginTop: '4%'}}>
                        <Button
                            label='Novo'
                            circular
                            color='orange'
                            icon='clipboard outline'
                            floated='right'
                            as={Link}
                            to='/form-pedido'
                        />
                        <br/><br/><br/>
                   
                        <Table color='orange' sortable celled>

                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Cliente</Table.HeaderCell>
                                    <Table.HeaderCell>Entregador</Table.HeaderCell>
                                    <Table.HeaderCell>Data do Pedido</Table.HeaderCell>
                                    <Table.HeaderCell>Status</Table.HeaderCell>
                                    <Table.HeaderCell>Valor Total</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Ações</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                       
                            <Table.Body>

                                { lista.map(pedido => (

                                    <Table.Row key={pedido.id}>
                                        <Table.Cell>{pedido.cliente?.nome}</Table.Cell>
                                        <Table.Cell>{pedido.entregador?.nome || 'Não atribuído'}</Table.Cell>
                                        <Table.Cell>{formatarData(pedido.dataPedido)}</Table.Cell>
                                        <Table.Cell>{pedido.statusPedido}</Table.Cell>
                                        <Table.Cell>R$ {pedido.valorTotal}</Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            <Button
                                                inverted
                                                circular
                                                color='green'
                                                title='Clique aqui para editar os dados deste pedido'
                                                icon>
                                                    <Link to="/form-pedido" state={{ id: pedido.id }} style={{ color: 'green' }}>
                                                        <Icon name='edit' />
                                                    </Link>
                                            </Button> &nbsp;
                                        </Table.Cell>
                                    </Table.Row>
                                ))}

                            </Table.Body>
                        </Table>
                    </div>
                </Container>
            </div>
        </div>
    )
}