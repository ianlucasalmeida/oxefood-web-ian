import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Divider, Header, Icon, Modal, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';
import { notifyError, notifySuccess } from '../../views/util/Util';

export default function ListFuncionario() {

    const [lista, setLista] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();
    const [openModalVisualizar, setOpenModalVisualizar] = useState(false);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState({});

    useEffect(() => {
        carregarLista();
    }, []);

    function carregarLista() {
        axios.get("http://localhost:8080/api/funcionario")
            .then((response) => setLista(response.data))
            .catch(() => notifyError("Erro ao carregar lista."));
    }

    function formatarData(dataParam) {
        if (!dataParam) return "";
        let arrayData = dataParam.split("-");
        return arrayData[2] + "/" + arrayData[1] + "/" + arrayData[0];
    }

    function confirmaRemover(id) {
        setOpenModal(true);
        setIdRemover(id);
    }

    async function remover() {
        await axios.delete('http://localhost:8080/api/funcionario/' + idRemover)
            .then(() => {
                notifySuccess('Funcionário removido com sucesso.');
                carregarLista();
            })
            .catch(() => notifyError('Erro ao remover.'));
        setOpenModal(false);
    }

    function visualizarDetalhes(id) {
        axios.get("http://localhost:8080/api/funcionario/" + id)
            .then((response) => {
                setFuncionarioSelecionado(response.data);
                setOpenModalVisualizar(true);
            });
    }

    return (
        <div>
            <MenuSistema tela={'funcionario'} />
            <div style={{ marginTop: '3%' }}>
                <Container textAlign='justified'>
                    <h2>Funcionário</h2>
                    <Divider />

                    <div style={{ marginTop: '4%' }}>
                        <Button label='Novo' circular color='orange' icon='clipboard outline' floated='right' as={Link} to='/form-funcionario' />
                        <br /><br /><br />

                        <Table color='orange' sortable celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Nome</Table.HeaderCell>
                                    <Table.HeaderCell>CPF</Table.HeaderCell>
                                    <Table.HeaderCell>Cargo</Table.HeaderCell>
                                    <Table.HeaderCell>Celular</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Ações</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {lista.map(f => (
                                    <Table.Row key={f.id}>
                                        <Table.Cell>{f.nome}</Table.Cell>
                                        <Table.Cell>{f.cpf}</Table.Cell>
                                        <Table.Cell>{f.tipo}</Table.Cell>
                                        <Table.Cell>{f.foneCelular}</Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            <Button circular color='blue' icon onClick={() => visualizarDetalhes(f.id)}>
                                                <Icon name='eye' />
                                            </Button> &nbsp;
                                            <Button inverted circular color='green' icon as={Link} to="/form-funcionario" state={{ id: f.id }}>
                                                <Icon name='edit' />
                                            </Button> &nbsp;
                                            <Button inverted circular color='red' icon onClick={() => confirmaRemover(f.id)}>
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

            {/* MODAL REMOÇÃO */}
            <Modal basic onClose={() => setOpenModal(false)} open={openModal}>
                <Header icon><Icon name='trash' /> Deseja remover este registro?</Header>
                <Modal.Actions>
                    <Button basic color='red' inverted onClick={() => setOpenModal(false)}><Icon name='remove' /> Não</Button>
                    <Button color='green' inverted onClick={() => remover()}><Icon name='checkmark' /> Sim</Button>
                </Modal.Actions>
            </Modal>

            {/* MODAL VISUALIZAÇÃO */}
            <Modal size='small' open={openModalVisualizar} onClose={() => setOpenModalVisualizar(false)}>
                <Modal.Header><Icon name='user' /> Detalhes do Funcionário</Modal.Header>
                <Modal.Content>
                    <p><strong>Nome:</strong> {funcionarioSelecionado.nome}</p>
                    <p><strong>CPF:</strong> {funcionarioSelecionado.cpf} | <strong>RG:</strong> {funcionarioSelecionado.rg}</p>
                    <p><strong>Cargo:</strong> {funcionarioSelecionado.tipo}</p>
                    <p><strong>Data Nascimento:</strong> {formatarData(funcionarioSelecionado.dataNascimento)}</p>
                    <p><strong>Contatos:</strong> {funcionarioSelecionado.foneCelular} / {funcionarioSelecionado.foneFixo}</p>
                </Modal.Content>
                <Modal.Actions><Button color='blue' onClick={() => setOpenModalVisualizar(false)}>Fechar</Button></Modal.Actions>
            </Modal>
        </div>
    );
}