import axios from "axios";
import InputMask from 'comigo-tech-react-input-mask';
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { Button, Container, Divider, Form, Icon, TextArea } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';
import { notifyError, notifySuccess } from '../../views/util/Util';

export default function FormProduto () {

    const [titulo, setTitulo] = useState('');
    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valorUnitario, setValorUnitario] = useState('');
    const [tempoEntregaMinimo, setTempoEntregaMinimo] = useState('');
    const [tempoEntregaMaximo, setTempoEntregaMaximo] = useState('');

    const [listaCategoria, setListaCategoria] = useState([]);
    const [idCategoria, setIdCategoria] = useState();

    const { state } = useLocation();
    const [idProduto, setIdProduto] = useState();

    useEffect(() => {
        axios.get("http://localhost:8080/api/categoriaproduto")
        .then((response) => {
            setListaCategoria(response.data);
        })
    }, []);

    useEffect(() => {
        if (state != null && state.id != null) {
            axios.get("http://localhost:8080/api/produto/" + state.id)
            .then((response) => {
                setIdProduto(response.data.id);
                setTitulo(response.data.titulo);
                setCodigo(response.data.codigo);
                setDescricao(response.data.descricao);
                setValorUnitario(response.data.valor);
                setTempoEntregaMinimo(response.data.tempoEntregaMinimo);
                setTempoEntregaMaximo(response.data.tempoEntregaMaximo);
                
                if (response.data.categoria != null) {
                    setIdCategoria(response.data.categoria.id);
                }
            })
        }
    }, [state]);

    function salvar() {
        let valorComPonto = String(valorUnitario).replace(',', '.');

        let produtoRequest = {
            idCategoria: idCategoria,
            titulo: titulo,
            codigo: codigo,
            descricao: descricao,
            valor: valorComPonto, 
            tempoEntregaMinimo: tempoEntregaMinimo,
            tempoEntregaMaximo: tempoEntregaMaximo
        }
    
        if (idProduto != null) { 
            axios.put("http://localhost:8080/api/produto/" + idProduto, produtoRequest)
            .then((response) => {
                notifySuccess('Produto alterado com sucesso!');
            })
            .catch((error) => {
                notifyError(error.response.data.message);
            });

        } else { 
            axios.post("http://localhost:8080/api/produto", produtoRequest)
            .then((response) => {
                notifySuccess('Produto cadastrado com sucesso!');
            })
            .catch((error) => {
                notifyError(error.response.data.message);
            });
        }
    }

    return (
        <div>
            <MenuSistema tela={'produto'} />
            <div style={{marginTop: '3%'}}>
                <Container textAlign='justified' >

                    {idProduto === undefined && (
                        <h2> 
                            <span style={{ color: "darkgray" }}> Produto &nbsp;<Icon name="angle double right" size="small" /> </span> 
                            Cadastro
                        </h2>
                    )}
                    {idProduto !== undefined && (
                        <h2> 
                            <span style={{ color: "darkgray" }}> Produto &nbsp;<Icon name="angle double right" size="small" /> </span> 
                            Alteração
                        </h2>
                    )}

                    <Divider />
                    <div style={{marginTop: '4%'}}>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Input required fluid label='Título' value={titulo} onChange={e => setTitulo(e.target.value)} />
                                <Form.Input required fluid label='Código do Produto'>
                                    <InputMask required value={codigo} onChange={e => setCodigo(e.target.value)} /> 
                                </Form.Input>
                                
                                <Form.Select
                                    required
                                    fluid
                                    tabIndex='3'
                                    placeholder='Selecione'
                                    label='Categoria'
                                    options={listaCategoria.map((c) => ({ key: c.id, text: c.descricao, value: c.id }))}
                                    value={idCategoria}
                                    onChange={(e, { value }) => { setIdCategoria(value) }}
                                />
                            </Form.Group>

                            <Form.Group widths='equal'>
                              <Form.Input fluid label='Descrição'>
                                  <TextArea maxLength="255" placeholder='Informe a descrição do produto' value={descricao} onChange={e => setDescricao(e.target.value)} />
                              </Form.Input>
                            </Form.Group>
                            
                            <Form.Group>
                                <Form.Input fluid label='Valor Unitário' width={6}>
                                    <InputMask placeholder="Ex: 12.50" value={valorUnitario} onChange={e => setValorUnitario(e.target.value)} /> 
                                </Form.Input>
                                <Form.Input fluid label='Tempo Mínimo (Minutos)' width={6}>
                                    <InputMask placeholder="30" value={tempoEntregaMinimo} onChange={e => setTempoEntregaMinimo(e.target.value)} /> 
                                </Form.Input>
                                <Form.Input fluid label='Tempo Máximo (Minutos)' width={6}>
                                    <InputMask placeholder="40" value={tempoEntregaMaximo} onChange={e => setTempoEntregaMaximo(e.target.value)} /> 
                                </Form.Input>
                            </Form.Group>
                        </Form>
                        
                        <div style={{marginTop: '4%'}}>
                            <Link to={"/list-produto"}>
                                <Button type="button" inverted circular icon labelPosition='left' color='orange'>
                                    <Icon name='reply' />
                                    Voltar
                                </Button>
                            </Link>
                                
                            <Button inverted circular icon labelPosition='left' color='blue' floated='right' onClick={() => salvar()}>
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