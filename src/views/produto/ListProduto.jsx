import axios from 'axios';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// IMPORTANTE: Adicionamos Header e Modal nas importações do Semantic UI
import { Button, Container, Divider, Header, Icon, Modal, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function ListProduto () {

    const [lista, setLista] = useState([]);
    
    // ESTADOS: Para controlar o modal de exclusão
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();

    // PASSO 1: ESTADOS: Para controlar o modal de visualização
    const [openModalVisualizar, setOpenModalVisualizar] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState({});

    useEffect(() => {
        carregarLista();
    }, [])

    function carregarLista() {
        axios.get("http://localhost:8080/api/produto")
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
        await axios.delete('http://localhost:8080/api/produto/' + idRemover)
        .then((response) => {
            console.log('Produto removido com sucesso.')
            axios.get("http://localhost:8080/api/produto")
            .then((response) => {
                setLista(response.data)
            })
        })
        .catch((error) => {
            console.log('Erro ao remover um produto.')
        })
        setOpenModal(false) 
    }

    // PASSO 2: FUNÇÃO DE BUSCA PARA VISUALIZAÇÃO
    function visualizarDetalhes(id) {
        axios.get("http://localhost:8080/api/produto/" + id)
        .then((response) => {
            setProdutoSelecionado(response.data);
            setOpenModalVisualizar(true);
        })
        .catch((error) => {
            console.log('Erro ao buscar os detalhes do produto.');
            alert('Erro ao buscar os detalhes do produto.');
        })
    }

    return(
        <div>
            <MenuSistema tela={'produto'} />
            <div style={{marginTop: '3%'}}>

                <Container textAlign='justified' >

                    <h2> Produto </h2>
                    <Divider />

                    <div style={{marginTop: '4%'}}>
                        <Button
                            label='Novo'
                            circular
                            color='orange'
                            icon='clipboard outline'
                            floated='right'
                            as={Link}
                            to='/form-produto'
                        />
                        <br/><br/><br/>
                   
                        <Table color='orange' sortable celled>

                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Código</Table.HeaderCell>
                                    <Table.HeaderCell>Título</Table.HeaderCell>
                                    <Table.HeaderCell>Descrição</Table.HeaderCell>
                                    <Table.HeaderCell>Valor</Table.HeaderCell>
                                    <Table.HeaderCell>Tempo de Entrega</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Ações</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                       
                            <Table.Body>

                                { lista.map(produto => (

                                    <Table.Row key={produto.id}>
                                        <Table.Cell>{produto.codigo}</Table.Cell>
                                        <Table.Cell>{produto.titulo}</Table.Cell>
                                        <Table.Cell>{produto.descricao}</Table.Cell>
                                        <Table.Cell>R$ {produto.valor}</Table.Cell>
                                        <Table.Cell>{produto.tempoEntregaMinimo} a {produto.tempoEntregaMaximo} min</Table.Cell>
                                        <Table.Cell textAlign='center'>

                                            {/* PASSO 3: BOTÃO DE VISUALIZAÇÃO (Azul Sólido) */}
                                            <Button
                                                circular
                                                color='blue'
                                                title='Clique aqui para visualizar os detalhes deste produto'
                                                icon
                                                onClick={() => visualizarDetalhes(produto.id)}
                                            >
                                                <Icon name='eye' />
                                            </Button> &nbsp;

                                            <Button
                                                inverted
                                                circular
                                                color='green'
                                                title='Clique aqui para editar os dados deste produto'
                                                icon>
                                                    <Link to="/form-produto" state={{ id: produto.id }} style={{ color: 'green' }}>
                                                        <Icon name='edit' />
                                                    </Link>
                                            </Button> &nbsp;
                                            
                                            <Button
                                                inverted
                                                circular
                                                color='red'
                                                title='Clique aqui para remover este produto'
                                                icon
                                                onClick={e => confirmaRemover(produto.id)}> 
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
                    <Icon name='box' /> Detalhes do Produto
                </Modal.Header>
                <Modal.Content>
                    <div style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
                        <p><strong>ID no Banco:</strong> {produtoSelecionado.id}</p>
                        <p><strong>Código do Produto:</strong> {produtoSelecionado.codigo}</p>
                        <p><strong>Título:</strong> {produtoSelecionado.titulo}</p>
                        <Divider />
                        <p><strong>Descrição:</strong> {produtoSelecionado.descricao}</p>
                        <Divider />
                        <p><strong>Valor Unitário:</strong> R$ {produtoSelecionado.valor}</p>
                        <p><strong>Tempo de Entrega:</strong> De {produtoSelecionado.tempoEntregaMinimo} até {produtoSelecionado.tempoEntregaMaximo} minutos</p>
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