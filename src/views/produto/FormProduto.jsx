import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Container, Divider, Form, Icon, Message } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function FormProduto() {

    const { state } = useLocation();
    const [idProduto, setIdProduto] = useState();

    const [codigo, setCodigo] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tempoEntregaMinimo, setTempoEntregaMinimo] = useState('');
    const [tempoEntregaMaximo, setTempoEntregaMaximo] = useState('');
    const [idCategoria, setIdCategoria] = useState('');
    const [listaCategoria, setListaCategoria] = useState([]);

    // ESTADO PARA ARMAZENAR A IMAGEM E A MENSAGEM
    const [file, setFile] = useState(null);
    const [mensagemSucesso, setMensagemSucesso] = useState('');

    useEffect(() => {
        if (state != null && state.id != null) {
            axios.get("http://localhost:8080/api/produto/" + state.id)
                .then((response) => {
                    setIdProduto(response.data.id);
                    setCodigo(response.data.codigo);
                    setTitulo(response.data.titulo);
                    setDescricao(response.data.descricao);
                    setValor(response.data.valor);
                    setTempoEntregaMinimo(response.data.tempoEntregaMinimo);
                    setTempoEntregaMaximo(response.data.tempoEntregaMaximo);
                    if (response.data.categoria) {
                        setIdCategoria(response.data.categoria.id);
                    }
                });
        }

        axios.get("http://localhost:8080/api/categoriaproduto")
            .then((response) => setListaCategoria(response.data));
    }, [state]);

    function salvar() {
        let formData = new FormData();
        formData.append('codigo', codigo);
        formData.append('titulo', titulo);
        formData.append('descricao', descricao);
        formData.append('valor', valor);
        formData.append('tempoEntregaMinimo', tempoEntregaMinimo);
        formData.append('tempoEntregaMaximo', tempoEntregaMaximo);
        formData.append('idCategoria', idCategoria);

        if (file != null) {
            formData.append('file', file);
        }

        if (idProduto != null) {
            axios.put("http://localhost:8080/api/produto/" + idProduto, formData)
                .then((response) => {
                    setMensagemSucesso('Produto alterado com sucesso!');
                })
                .catch((error) => console.log('Erro ao alterar um produto.', error));
        } else {
            axios.post("http://localhost:8080/api/produto", formData)
                .then((response) => {
                    setMensagemSucesso('Produto cadastrado com sucesso!');
                    // Limpar os campos após o cadastro (opcional)
                    setCodigo('');
                    setTitulo('');
                    setDescricao('');
                    setValor('');
                    setTempoEntregaMinimo('');
                    setTempoEntregaMaximo('');
                    setIdCategoria('');
                    setFile(null);
                })
                .catch((error) => console.log('Erro ao incluir o produto.', error));
        }
    }

    return (
        <div>
            <MenuSistema tela={'produto'} />

            <div style={{ marginTop: '3%' }}>
                <Container textAlign='justified'>

                    {idProduto === undefined ?
                        <h2> <span style={{ color: 'darkgray' }}> Produto &nbsp;<Icon name='angle double right' size="small" /> </span> Cadastro</h2>
                        :
                        <h2> <span style={{ color: 'darkgray' }}> Produto &nbsp;<Icon name='angle double right' size="small" /> </span> Alteração</h2>
                    }

                    <Divider />

                    {/* BLOCO DA MENSAGEM DE SUCESSO */}
                    {mensagemSucesso && (
                        <Message
                            success
                            icon='check'
                            header='Sucesso!'
                            content={mensagemSucesso}
                            onDismiss={() => setMensagemSucesso('')}
                        />
                    )}

                    <div style={{ marginTop: '4%' }}>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Input
                                    required
                                    fluid
                                    label='Título'
                                    maxLength="100"
                                    value={titulo}
                                    onChange={e => setTitulo(e.target.value)}
                                />
                                <Form.Input
                                    required
                                    fluid
                                    label='Código do Produto'
                                    value={codigo}
                                    onChange={e => setCodigo(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group widths='equal'>
                                <Form.Select
                                    required
                                    fluid
                                    tabIndex='3'
                                    placeholder='Selecione'
                                    label='Categoria'
                                    options={listaCategoria.map((c) => ({ key: c.id, text: c.descricao, value: c.id }))}
                                    value={idCategoria}
                                    onChange={(e, { value }) => setIdCategoria(value)}
                                />
                                
                                <Form.Input
                                    fluid
                                    label='Imagem do Produto'
                                    type="file"
                                    onChange={e => setFile(e.target.files[0])}
                                />
                            </Form.Group>

                            <Form.Group widths='equal'>
                                <Form.TextArea
                                    label='Descrição'
                                    value={descricao}
                                    onChange={e => setDescricao(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Input
                                    required
                                    fluid
                                    label='Valor Unitário'
                                    width={6}
                                    value={valor}
                                    onChange={e => setValor(e.target.value)}
                                />
                                <Form.Input
                                    fluid
                                    label='Tempo de Entrega Mínimo em Minutos'
                                    width={5}
                                    value={tempoEntregaMinimo}
                                    onChange={e => setTempoEntregaMinimo(e.target.value)}
                                />
                                <Form.Input
                                    fluid
                                    label='Tempo de Entrega Máximo em Minutos'
                                    width={5}
                                    value={tempoEntregaMaximo}
                                    onChange={e => setTempoEntregaMaximo(e.target.value)}
                                />
                            </Form.Group>
                        </Form>

                        <div style={{ marginTop: '4%' }}>
                            <Button
                                type="button"
                                inverted
                                circular
                                icon
                                labelPosition='left'
                                color='orange'
                            >
                                <Icon name='reply' />
                                <Link to='/list-produto'>Voltar</Link>
                            </Button>

                            <Button
                                inverted
                                circular
                                icon
                                labelPosition='left'
                                color='blue'
                                floated='right'
                                onClick={() => salvar()}
                            >
                                <Icon name='save' />
                                Salvar
                            </Button>
                        </div>

                    </div>
                </Container>
            </div>
        </div>
    );
}