import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Divider, Form, Header, Icon, Image, Modal, Segment, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function ListProduto() {
    const [lista, setLista] = useState([]);
    const [listaCategoriaProduto, setListaCategoriaProduto] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();

    // Estados para o Filtro de Pesquisa
    const [codigoBusca, setCodigoBusca] = useState('');
    const [tituloBusca, setTituloBusca] = useState('');
    const [idCategoriaBusca, setIdCategoriaBusca] = useState('');

    // Estados para o Modal de Visualização Completa
    const [openModalVisualizar, setOpenModalVisualizar] = useState(false);
    const [produtoVisualizar, setProdutoVisualizar] = useState({});

    useEffect(() => {
        carregarLista();
        
        axios.get("http://localhost:8080/api/categoriaproduto")
             .then((response) => setListaCategoriaProduto(response.data));
    }, []);

    function carregarLista() {
        axios.get("http://localhost:8080/api/produto")
             .then((response) => setLista(response.data));
    }

    function filtrarProdutos() {
        let formData = new FormData();
        formData.append('codigo', codigoBusca);
        formData.append('titulo', tituloBusca);
        
        if (idCategoriaBusca !== '' && idCategoriaBusca !== undefined) {
            formData.append('idCategoria', idCategoriaBusca);
        }

        axios.post("http://localhost:8080/api/produto/filtrar", formData)
             .then((response) => setLista(response.data))
             .catch((error) => console.log(error));
    }

    function confirmaRemover(id) {
        setOpenModal(true);
        setIdRemover(id);
    }

    async function remover() {
        await axios.delete('http://localhost:8080/api/produto/' + idRemover)
        .then((response) => {
            carregarLista();
        })
        .catch((error) => {
            console.log('Erro ao remover um produto.');
        });
        setOpenModal(false);
    }

    function visualizar(produto) {
        setProdutoVisualizar(produto);
        setOpenModalVisualizar(true);
    }

    return (
        <div>
            <MenuSistema tela={'produto'} />
            <div style={{ marginTop: '3%' }}>
                <Container textAlign='justified'>
                    <h2>Produto</h2>
                    <Divider />

                    <div style={{ marginTop: '4%' }}>
                        {/* PAINEL DE FILTRO */}
                        <Segment color='grey'>
                            <Form>
                                <Form.Group widths='equal'>
                                    <Form.Input
                                        icon="search"
                                        value={codigoBusca}
                                        onChange={e => setCodigoBusca(e.target.value)}
                                        label='Código do Produto'
                                        placeholder='Filtrar por Código'
                                        labelPosition='left'
                                    />
                                    <Form.Input
                                        icon="search"
                                        value={tituloBusca}
                                        onChange={e => setTituloBusca(e.target.value)}
                                        label='Título'
                                        placeholder='Filtrar por Título'
                                        labelPosition='left'
                                    />
                                    <Form.Select
                                        placeholder='Filtrar por Categoria'
                                        label='Categoria'
                                        options={listaCategoriaProduto.map((c) => ({ key: c.id, text: c.descricao, value: c.id }))}
                                        value={idCategoriaBusca}
                                        onChange={(e, { value }) => setIdCategoriaBusca(value)}
                                        clearable
                                    />
                                </Form.Group>
                                <Button color='blue' onClick={filtrarProdutos}>
                                    <Icon name='filter' /> Filtrar
                                </Button>
                                <Button onClick={() => { setCodigoBusca(''); setTituloBusca(''); setIdCategoriaBusca(''); carregarLista(); }}>
                                    <Icon name='refresh' /> Limpar
                                </Button>
                            </Form>
                        </Segment>

                        <br />
                        <Button
                            label='Novo'
                            circular
                            color='orange'
                            icon='clipboard outline'
                            floated='right'
                            as={Link}
                            to='/form-produto'
                        />
                        <br /><br /><br />

                        {/* TABELA DE LISTAGEM */}
                        <Table color='orange' sortable celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Código</Table.HeaderCell>
                                    <Table.HeaderCell>Categoria</Table.HeaderCell>
                                    <Table.HeaderCell>Título</Table.HeaderCell>
                                    <Table.HeaderCell>Descrição</Table.HeaderCell>
                                    <Table.HeaderCell>Valor Unitário</Table.HeaderCell>
                                    <Table.HeaderCell>Tempo Mínimo</Table.HeaderCell>
                                    <Table.HeaderCell>Tempo Máximo</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Ações</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {lista.map(produto => (
                                    <Table.Row key={produto.id}>
                                        <Table.Cell>{produto.codigo}</Table.Cell>
                                        <Table.Cell>{produto.categoria?.descricao}</Table.Cell>
                                        <Table.Cell>{produto.titulo}</Table.Cell>
                                        <Table.Cell>{produto.descricao}</Table.Cell>
                                        <Table.Cell>R$ {produto.valor}</Table.Cell>
                                        <Table.Cell>{produto.tempoEntregaMinimo} min</Table.Cell>
                                        <Table.Cell>{produto.tempoEntregaMaximo} min</Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            
                                            {/* BOTÃO DE VISÃO - Padronizado (Azul Sólido) */}
                                            <Button 
                                                circular 
                                                color='blue' 
                                                title='Visualizar detalhes do produto' 
                                                icon 
                                                onClick={() => visualizar(produto)}
                                            >
                                                <Icon name='eye' />
                                            </Button> &nbsp;
                                            
                                            {/* BOTÃO DE EDIÇÃO - Padronizado (Alinhamento Corrigido com as={Link}) */}
                                            <Button 
                                                inverted 
                                                circular 
                                                color='green' 
                                                title='Clique aqui para editar os dados deste produto' 
                                                icon
                                                as={Link}
                                                to="/form-produto"
                                                state={{ id: produto.id }}
                                            >
                                                <Icon name='edit' />
                                            </Button> &nbsp;
                                            
                                            {/* BOTÃO DE REMOÇÃO */}
                                            <Button 
                                                inverted 
                                                circular 
                                                color='red' 
                                                title='Clique aqui para remover este produto' 
                                                icon 
                                                onClick={() => confirmaRemover(produto.id)}
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
            <Modal basic onClose={() => setOpenModal(false)} onOpen={() => setOpenModal(true)} open={openModal}>
                <Header icon>
                    <Icon name='trash' />
                    <div style={{ marginTop: '5%' }}> Tem a certeza que deseja remover este registo? </div>
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

            {/* MODAL DE VISUALIZAÇÃO COM IMAGEM */}
            <Modal onClose={() => setOpenModalVisualizar(false)} open={openModalVisualizar} closeIcon>
                <Modal.Header>Detalhes do Produto Cadastrado</Modal.Header>
                <Modal.Content image scrolling>
                    <div style={{ marginRight: '30px', textAlign: 'center' }}>
                        {produtoVisualizar.imagem ? (
                            <Image 
                                size='medium' 
                                src={`http://localhost:8080/api/produto/imagem/${produtoVisualizar.imagem}`} 
                                rounded 
                                bordered
                                style={{ maxHeight: '280px', objectFit: 'cover' }}
                            />
                        ) : (
                            <Segment placeholder style={{ width: '250px', height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Header icon>
                                    <Icon name='image outline' color='grey' />
                                    Sem Imagem
                                </Header>
                            </Segment>
                        )}
                    </div>
                    
                    <Modal.Description style={{ width: '100%' }}>
                        <Header as='h2' color='orange'>{produtoVisualizar.titulo}</Header>
                        <Divider />
                        <p style={{ fontSize: '15px' }}><strong>Código do Produto:</strong> {produtoVisualizar.codigo}</p>
                        <p style={{ fontSize: '15px' }}><strong>Categoria:</strong> {produtoVisualizar.categoria?.descricao || 'Não cadastrada'}</p>
                        <p style={{ fontSize: '15px' }}><strong>Valor Unitário:</strong> R$ {produtoVisualizar.valor}</p>
                        <p style={{ fontSize: '15px' }}><strong>Tempo de Entrega:</strong> {produtoVisualizar.tempoEntregaMinimo} a {produtoVisualizar.tempoEntregaMaximo} minutos</p>
                        <br />
                        <Header as='h4'>Descrição do Item:</Header>
                        <Segment secondary style={{ minHeight: '60px', fontSize: '14px' }}>
                            {produtoVisualizar.descricao || 'Este produto não possui uma descrição cadastrada.'}
                        </Segment>
                    </Modal.Description>
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