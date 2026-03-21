import axios from 'axios';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Divider, Header, Icon, Modal, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function ListEntregador () {

    const [lista, setLista] = useState([]);

    // ESTADOS: Modal de exclusão
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();

    // PASSO 1: ESTADOS: Modal de visualização
    const [openModalVisualizar, setOpenModalVisualizar] = useState(false);
    const [entregadorSelecionado, setEntregadorSelecionado] = useState({});

    useEffect(() => {
        carregarLista();
    }, [])

    function carregarLista() {
        axios.get("http://localhost:8080/api/entregador")
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

    // --- FUNÇÕES DE REMOÇÃO ---
    function confirmaRemover(id) {
        setOpenModal(true);
        setIdRemover(id);
    }

    async function remover() {
        await axios.delete('http://localhost:8080/api/entregador/' + idRemover)
        .then((response) => {
            console.log('Entregador removido com sucesso.')
            axios.get("http://localhost:8080/api/entregador")
            .then((response) => {
                setLista(response.data)
            })
        })
        .catch((error) => {
            console.log('Erro ao remover um entregador.')
        })
        setOpenModal(false); 
    }

    // PASSO 2: FUNÇÃO DE BUSCA PARA VISUALIZAÇÃO
    function visualizarDetalhes(id) {
        axios.get("http://localhost:8080/api/entregador/" + id)
        .then((response) => {
            setEntregadorSelecionado(response.data);
            setOpenModalVisualizar(true);
        })
        .catch((error) => {
            console.log('Erro ao buscar os detalhes do entregador.');
            alert('Erro ao buscar os detalhes.');
        })
    }

    return(
        <div>
            <MenuSistema tela={'entregador'} />
            <div style={{marginTop: '3%'}}>

                <Container textAlign='justified' >

                    <h2> Entregador </h2>
                    <Divider />

                    <div style={{marginTop: '4%'}}>
                        <Button
                            label='Novo'
                            circular
                            color='orange'
                            icon='clipboard outline'
                            floated='right'
                            as={Link}
                            to='/form-entregador'
                        />
                        <br/><br/><br/>
                  
                        <Table color='orange' sortable celled>

                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Nome</Table.HeaderCell>
                                    <Table.HeaderCell>CPF</Table.HeaderCell>
                                    <Table.HeaderCell>Data de Nascimento</Table.HeaderCell>
                                    <Table.HeaderCell>Fone Celular</Table.HeaderCell>
                                    <Table.HeaderCell>Fone Fixo</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Ações</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                      
                            <Table.Body>

                                { lista.map(entregador => (

                                    <Table.Row key={entregador.id}>
                                        <Table.Cell>{entregador.nome}</Table.Cell>
                                        <Table.Cell>{entregador.cpf}</Table.Cell>
                                        <Table.Cell>{formatarData(entregador.dataNascimento)}</Table.Cell>
                                        <Table.Cell>{entregador.foneCelular}</Table.Cell>
                                        <Table.Cell>{entregador.foneFixo}</Table.Cell>
                                        <Table.Cell textAlign='center'>

                                            {/* PASSO 3: BOTÃO DE VISUALIZAÇÃO (Azul Sólido) */}
                                            <Button
                                                circular
                                                color='blue'
                                                title='Clique aqui para visualizar os detalhes deste entregador'
                                                icon
                                                onClick={() => visualizarDetalhes(entregador.id)}
                                            >
                                                <Icon name='eye' />
                                            </Button> &nbsp;

                                            <Button
                                                inverted
                                                circular
                                                color='green'
                                                title='Clique aqui para editar os dados deste entregador'
                                                icon>
                                                    <Link to="/form-entregador" state={{ id: entregador.id }} style={{ color: 'green' }}>
                                                        <Icon name='edit' />
                                                    </Link>
                                            </Button> &nbsp;

                                            <Button
                                                inverted
                                                circular
                                                color='red'
                                                title='Clique aqui para remover este entregador'
                                                icon
                                                onClick={e => confirmaRemover(entregador.id)}> 
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

            {/* MODAL DE REMOÇÃO (Já existia) */}
            <Modal
                basic
                onClose={() => setOpenModal(false)}
                onOpen={() => setOpenModal(true)}
                open={openModal}
            >
                <Header icon>
                    <Icon name='trash' />
                    <div style={{marginTop: '5%'}}> Tem certeza que deseja remover esse registro? </div>
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

            {/* PASSO 4: MODAL DE VISUALIZAÇÃO */}
            <Modal
                size='small'
                open={openModalVisualizar}
                onClose={() => setOpenModalVisualizar(false)}
            >
                <Modal.Header>
                    <Icon name='address card outline' /> Detalhes do Entregador
                </Modal.Header>
                <Modal.Content>
                    <div style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
                        <p><strong>Nome Completo:</strong> {entregadorSelecionado.nome}</p>
                        <p><strong>CPF:</strong> {entregadorSelecionado.cpf}</p>
                        <p><strong>RG:</strong> {entregadorSelecionado.rg}</p>
                        <p><strong>Data de Nascimento:</strong> {formatarData(entregadorSelecionado.dataNascimento)}</p>
                        <p><strong>Contatos:</strong> Cel: {entregadorSelecionado.foneCelular} | Fixo: {entregadorSelecionado.foneFixo}</p>
                        <Divider />
                        <p><strong>Entregas Realizadas:</strong> {entregadorSelecionado.qtdEntregasRealizadas}</p>
                        <p><strong>Valor por Frete:</strong> R$ {entregadorSelecionado.valorFrete}</p>
                        <p><strong>Status:</strong> {entregadorSelecionado.ativo ? 'Ativo' : 'Inativo'}</p>
                        <Divider />
                        <p><strong>Endereço:</strong> {entregadorSelecionado.rua}, {entregadorSelecionado.numero}</p>
                        <p><strong>Bairro:</strong> {entregadorSelecionado.bairro} - {entregadorSelecionado.cidade}/{entregadorSelecionado.uf}</p>
                        <p><strong>CEP:</strong> {entregadorSelecionado.cep}</p>
                        {entregadorSelecionado.complemento && (
                            <p><strong>Complemento:</strong> {entregadorSelecionado.complemento}</p>
                        )}
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='blue' onClick={() => setOpenModalVisualizar(false)}>
                        Fechar
                    </Button>
                </Modal.Actions>
            </Modal>

        </div>
    )
}