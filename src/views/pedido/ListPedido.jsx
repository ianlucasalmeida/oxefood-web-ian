import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Divider, Header, Icon, Modal, Segment, Table, Message } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';
import { notifyError, notifySuccess } from '../../views/util/Util';

export default function ListPedido() {

    const [lista, setLista] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();
    
    // Estados para o Modal de Visualização
    const [openModalVisualizar, setOpenModalVisualizar] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState({});

    useEffect(() => {
        carregarLista();
    }, []);

    function carregarLista() {
        axios.get("http://localhost:8080/api/pedido")
            .then((response) => setLista(response.data))
            .catch((error) => console.log('Erro ao carregar a lista de pedidos.', error));
    }

    // Formata a data que vem do Spring Boot (YYYY-MM-DD para DD/MM/YYYY)
    function formatarData(dataParam) {
        if (!dataParam) return '';
        // Caso a data venha com hora (ex: 2026-05-24T15:30:00), dividimos no 'T'
        let dataApenas = dataParam.includes('T') ? dataParam.split('T')[0] : dataParam;
        let arrayData = dataApenas.split('-');
        if (arrayData.length === 3) {
            return `${arrayData[2]}/${arrayData[1]}/${arrayData[0]}`;
        }
        return dataParam;
    }

    function confirmaRemover(id) {
        setOpenModal(true);
        setIdRemover(id);
    }

    async function remover() {
        await axios.delete('http://localhost:8080/api/pedido/' + idRemover)
            .then(() => {
                notifySuccess('Pedido removido com sucesso.');
                carregarLista();
            })
            .catch(() => notifyError('Erro ao remover o pedido.'));
        setOpenModal(false);
    }

    function visualizarDetalhes(pedido) {
        setPedidoSelecionado(pedido);
        setOpenModalVisualizar(true);
    }

    return (
        <div>
            <MenuSistema tela={'pedido'} />
            <div style={{ marginTop: '3%' }}>
                <Container textAlign='justified'>
                    <h2> Gerenciamento de Pedidos </h2>
                    <Divider />

                    <div style={{ marginTop: '4%' }}>
                        <Button
                            label='Nova Venda'
                            circular
                            color='orange'
                            icon='cart'
                            floated='right'
                            as={Link}
                            to='/form-pedido'
                        />
                        <br /><br /><br />

                        <Table color='orange' sortable celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Data</Table.HeaderCell>
                                    <Table.HeaderCell>Cliente</Table.HeaderCell>
                                    <Table.HeaderCell>Entregador</Table.HeaderCell>
                                    <Table.HeaderCell>Valor Total</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Ações</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {lista.map(pedido => (
                                    <Table.Row key={pedido.id}>
                                        <Table.Cell>{formatarData(pedido.dataPedido || pedido.dataCriacao)}</Table.Cell>
                                        <Table.Cell>{pedido.cliente?.nome}</Table.Cell>
                                        <Table.Cell>{pedido.entregador?.nome || <span style={{ color: 'gray' }}>Não atribuído</span>}</Table.Cell>
                                        <Table.Cell>
                                            <strong>R$ {pedido.valorTotal ? pedido.valorTotal.toFixed(2) : '0.00'}</strong>
                                        </Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            
                                            <Button 
                                                circular 
                                                color='blue' 
                                                title='Visualizar detalhes do pedido' 
                                                icon 
                                                onClick={() => visualizarDetalhes(pedido)}
                                            >
                                                <Icon name='eye' />
                                            </Button> &nbsp;

                                            <Button 
                                                inverted 
                                                circular 
                                                color='red' 
                                                title='Cancelar / Remover Pedido' 
                                                icon 
                                                onClick={() => confirmaRemover(pedido.id)}
                                            >
                                                <Icon name='trash' />
                                            </Button>

                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </Container>
            </div>

            {/* MODAL DE REMOÇÃO */}
            <Modal basic onClose={() => setOpenModal(false)} open={openModal}>
                <Header icon>
                    <Icon name='trash' />
                    <div style={{ marginTop: '5%' }}> Tem certeza que deseja excluir este pedido do sistema? </div>
                </Header>
                <Modal.Actions>
                    <Button basic color='red' inverted onClick={() => setOpenModal(false)}>
                        <Icon name='remove' /> Não
                    </Button>
                    <Button color='green' inverted onClick={() => remover()}>
                        <Icon name='checkmark' /> Sim
                    </Button>
                </Modal.Actions>
            </Modal>

            {/* MODAL DE VISUALIZAÇÃO DOS ITENS DO PEDIDO */}
            <Modal size='large' open={openModalVisualizar} onClose={() => setOpenModalVisualizar(false)} closeIcon>
                <Modal.Header>
                    <Icon name='shopping bag' /> Detalhes do Pedido #{pedidoSelecionado.id}
                </Modal.Header>
                <Modal.Content scrolling>
                    <Segment>
                        <Header as="h4">Resumo da Venda</Header>
                        <p><strong>Cliente:</strong> {pedidoSelecionado.cliente?.nome} ({pedidoSelecionado.cliente?.foneCelular})</p>
                        <p><strong>Entregador:</strong> {pedidoSelecionado.entregador?.nome || 'Retirada no Balcão'}</p>
                        <p><strong>Data:</strong> {formatarData(pedidoSelecionado.dataPedido || pedidoSelecionado.dataCriacao)}</p>
                        {pedidoSelecionado.observacao && (
                            <Message info>
                                <Message.Header>Observação do Cliente:</Message.Header>
                                <p>{pedidoSelecionado.observacao}</p>
                            </Message>
                        )}
                    </Segment>

                    <Header as="h4" style={{ marginTop: '20px' }}>Itens Consumidos</Header>
                    <Table celled striped color="blue">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Produto</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Qtd.</Table.HeaderCell>
                                <Table.HeaderCell textAlign="right">Valor Unitário</Table.HeaderCell>
                                <Table.HeaderCell textAlign="right">Subtotal</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {pedidoSelecionado.itens && pedidoSelecionado.itens.length > 0 ? (
                                pedidoSelecionado.itens.map((item, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{item.produto?.titulo}</Table.Cell>
                                        <Table.Cell textAlign="center">{item.quantidade}</Table.Cell>
                                        <Table.Cell textAlign="right">R$ {item.produto?.valor ? item.produto.valor.toFixed(2) : '0.00'}</Table.Cell>
                                        <Table.Cell textAlign="right">
                                            <strong>R$ {item.valorItem ? item.valorItem.toFixed(2) : (item.quantidade * (item.produto?.valor || 0)).toFixed(2)}</strong>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan='4' textAlign='center' style={{ color: 'gray' }}>Nenhum item detalhado neste pedido.</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    
                    <div style={{ textAlign: 'right', marginTop: '15px', fontSize: '18px' }}>
                        <span>Total do Pedido: </span>
                        <strong style={{ color: '#ff8c00', fontSize: '24px' }}>
                            R$ {pedidoSelecionado.valorTotal ? pedidoSelecionado.valorTotal.toFixed(2) : '0.00'}
                        </strong>
                    </div>

                </Modal.Content>
                <Modal.Actions>
                    <Button color='grey' onClick={() => setOpenModalVisualizar(false)}>
                        Fechar
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
}