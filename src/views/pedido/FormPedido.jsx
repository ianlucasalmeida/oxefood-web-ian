import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Divider, Form, Icon, Table, Segment, Header } from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";
import { notifyError, notifySuccess } from "../../views/util/Util";

export default function FormPedido() {
    const navigate = useNavigate();

    // Estados do Cabeçalho do Pedido
    const [idCliente, setIdCliente] = useState("");
    const [idEntregador, setIdEntregador] = useState("");
    const [observacao, setObservacao] = useState("");

    // Estados do Item (Carrinho)
    const [idProduto, setIdProduto] = useState("");
    const [quantidade, setQuantidade] = useState(1);
    const [listaItens, setListaItens] = useState([]);

    // Estados para preencher os Selects (Dropdowns)
    const [listaClientes, setListaClientes] = useState([]);
    const [listaEntregadores, setListaEntregadores] = useState([]);
    const [listaProdutos, setListaProdutos] = useState([]);

    useEffect(() => {
        // Carrega as listas para os Dropdowns ao abrir a tela
        axios.get("http://localhost:8080/api/cliente").then((response) => setListaClientes(response.data));
        axios.get("http://localhost:8080/api/entregador").then((response) => setListaEntregadores(response.data));
        axios.get("http://localhost:8080/api/produto").then((response) => setListaProdutos(response.data));
    }, []);

    // --- LÓGICA DO CARRINHO DE COMPRAS ---
    function adicionarItem() {
        if (!idProduto || quantidade <= 0) {
            notifyError("Selecione um produto e informe uma quantidade válida.");
            return;
        }

        // Busca os detalhes do produto selecionado para exibir o título na tabela
        const produtoSelecionado = listaProdutos.find(p => p.id === idProduto);

        const novoItem = {
            produto: { id: idProduto },
            tituloProduto: produtoSelecionado.titulo, // Apenas para exibição no Front
            quantidade: quantidade
        };

        setListaItens([...listaItens, novoItem]);
        
        // Limpa os campos após adicionar
        setIdProduto("");
        setQuantidade(1);
    }

    function removerItem(indexParaRemover) {
        const novaLista = listaItens.filter((item, index) => index !== indexParaRemover);
        setListaItens(novaLista);
    }

    // --- SALVAR PEDIDO COMPLETO ---
    function salvarPedido() {
        if (!idCliente || listaItens.length === 0) {
            notifyError("Selecione um cliente e adicione pelo menos um item ao pedido.");
            return;
        }

        // Monta o JSON exato que o Spring Boot espera receber
        let pedidoRequest = {
            cliente: { id: idCliente },
            entregador: idEntregador ? { id: idEntregador } : null, // Entregador é opcional no início
            observacao: observacao,
            itens: listaItens.map(item => ({
                produto: { id: item.produto.id },
                quantidade: item.quantidade
            }))
        };

        axios.post("http://localhost:8080/api/pedido", pedidoRequest)
            .then(() => {
                notifySuccess("Pedido registrado com sucesso!");
                navigate('/list-pedido');
            })
            .catch((error) => {
                notifyError("Erro ao registrar o pedido. Verifique o console.");
                console.log(error);
            });
    }

    return (
        <div>
            <MenuSistema tela={"pedido"} />
            <div style={{ marginTop: "3%" }}>
                <Container textAlign="justified">
                    <h2><span style={{ color: "darkgray" }}> Pedido &nbsp;<Icon name="angle double right" size="small" /> </span> Nova Venda</h2>
                    <Divider />

                    <div style={{ marginTop: "4%" }}>
                        {/* 1. CABEÇALHO DO PEDIDO */}
                        <Header as="h4">Dados do Cliente e Entrega</Header>
                        <Segment>
                            <Form>
                                <Form.Group widths="equal">
                                    <Form.Select
                                        required
                                        fluid
                                        label="Cliente"
                                        options={listaClientes.map(c => ({ key: c.id, text: c.nome, value: c.id }))}
                                        placeholder="Selecione o Cliente"
                                        value={idCliente}
                                        onChange={(e, { value }) => setIdCliente(value)}
                                        search
                                    />
                                    <Form.Select
                                        fluid
                                        label="Entregador"
                                        options={listaEntregadores.map(e => ({ key: e.id, text: e.nome, value: e.id }))}
                                        placeholder="Selecione o Entregador (Opcional)"
                                        value={idEntregador}
                                        onChange={(e, { value }) => setIdEntregador(value)}
                                        clearable
                                        search
                                    />
                                </Form.Group>
                                <Form.Input 
                                    fluid 
                                    label="Observações do Pedido" 
                                    placeholder="Ex: Tirar cebola, campainha quebrada..."
                                    value={observacao} 
                                    onChange={(e) => setObservacao(e.target.value)} 
                                />
                            </Form>
                        </Segment>

                        {/* 2. ADICIONAR ITENS (CARRINHO) */}
                        <Header as="h4" style={{ marginTop: "30px" }}>Itens do Pedido</Header>
                        <Segment color="orange">
                            <Form>
                                <Form.Group widths="equal" style={{ alignItems: "flex-end" }}>
                                    <Form.Select
                                        fluid
                                        label="Produto"
                                        options={listaProdutos.map(p => ({ key: p.id, text: p.titulo, value: p.id }))}
                                        placeholder="Selecione o Produto"
                                        value={idProduto}
                                        onChange={(e, { value }) => setIdProduto(value)}
                                        search
                                    />
                                    <Form.Input 
                                        fluid 
                                        label="Quantidade" 
                                        type="number" 
                                        min="1"
                                        value={quantidade} 
                                        onChange={(e) => setQuantidade(e.target.value)} 
                                        style={{ maxWidth: "150px" }}
                                    />
                                    <Button color="blue" onClick={adicionarItem} style={{ marginBottom: "14px" }}>
                                        <Icon name="plus" /> Adicionar
                                    </Button>
                                </Form.Group>
                            </Form>

                            {/* TABELA DO CARRINHO */}
                            {listaItens.length > 0 && (
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Produto</Table.HeaderCell>
                                            <Table.HeaderCell textAlign="center">Quantidade</Table.HeaderCell>
                                            <Table.HeaderCell textAlign="center">Ação</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {listaItens.map((item, index) => (
                                            <Table.Row key={index}>
                                                <Table.Cell>{item.tituloProduto}</Table.Cell>
                                                <Table.Cell textAlign="center">{item.quantidade}</Table.Cell>
                                                <Table.Cell textAlign="center">
                                                    <Button inverted circular color="red" icon onClick={() => removerItem(index)}>
                                                        <Icon name="trash" />
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            )}
                            {listaItens.length === 0 && (
                                <p style={{ textAlign: "center", color: "gray", marginTop: "20px" }}>Nenhum item adicionado ao pedido.</p>
                            )}
                        </Segment>

                        {/* 3. AÇÕES FINAIS */}
                        <div style={{ marginTop: "4%" }}>
                            <Button as={Link} to="/list-pedido" type="button" inverted circular icon labelPosition="left" color="orange">
                                <Icon name="reply" /> Voltar
                            </Button>

                            <Button inverted circular icon labelPosition="left" color="green" floated="right" onClick={salvarPedido}>
                                <Icon name="check" /> Finalizar Pedido
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}