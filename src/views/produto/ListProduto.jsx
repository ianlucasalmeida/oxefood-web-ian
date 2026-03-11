import axios from 'axios';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// IMPORTANTE: Adicionamos Header e Modal nas importações do Semantic UI
import { Button, Container, Divider, Header, Icon, Modal, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function ListProduto () {

    const [lista, setLista] = useState([]);
    
    // NOVOS ESTADOS: Para controlar o modal de exclusão
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();

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

    // NOVA FUNÇÃO: Abre o modal e guarda qual ID será removido
    function confirmaRemover(id) {
        setOpenModal(true);
        setIdRemover(id);
    }

    // NOVA FUNÇÃO: Faz a requisição DELETE para o back-end
    async function remover() {
        await axios.delete('http://localhost:8080/api/produto/' + idRemover)
        .then((response) => {
            console.log('Produto removido com sucesso.')
  
            // Após remover, recarrega a lista para sumir da tela
            axios.get("http://localhost:8080/api/produto")
            .then((response) => {
                setLista(response.data)
            })
        })
        .catch((error) => {
            console.log('Erro ao remover um produto.')
        })
        setOpenModal(false) // Fecha o modal após o processo
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

                                            <Button
                                                inverted
                                                circular
                                                color='green'
                                                title='Clique aqui para editar os dados deste produto'
                                                icon>
                                                    {/* AJUSTE: Link passando o state com o ID para a tela de form */}
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
                                                onClick={e => confirmaRemover(produto.id)}> {/* AJUSTE: Chama o Modal */}
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

            {/* NOVO COMPONENTE: Modal de confirmação de exclusão */}
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

        </div>
    )
}