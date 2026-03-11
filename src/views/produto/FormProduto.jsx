import axios from "axios";
import InputMask from 'comigo-tech-react-input-mask';
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Importação do useLocation e Link
import { Button, Container, Divider, Form, Icon, TextArea } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function FormProduto () {

    const [titulo, setTitulo] = useState('');
    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valorUnitario, setValorUnitario] = useState('');
    const [tempoEntregaMinimo, setTempoEntregaMinimo] = useState('');
    const [tempoEntregaMaximo, setTempoEntregaMaximo] = useState('');

    // NOVOS ESTADOS PARA EDIÇÃO
    const { state } = useLocation();
    const [idProduto, setIdProduto] = useState();

    // NOVO: useEffect para buscar os dados caso seja uma alteração
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
            })
        }
    }, [state]);

    function salvar() {
        // Tratamento da vírgula (convertendo para String antes para evitar erros caso venha do backend como Number)
        let valorComPonto = String(valorUnitario).replace(',', '.');

        let produtoRequest = {
            titulo: titulo,
            codigo: codigo,
            descricao: descricao,
            valor: valorComPonto, 
            tempoEntregaMinimo: tempoEntregaMinimo,
            tempoEntregaMaximo: tempoEntregaMaximo
        }
    
        // LÓGICA DE DECISÃO: Alterar (PUT) ou Cadastrar (POST)
        if (idProduto != null) { // Alteração
            axios.put("http://localhost:8080/api/produto/" + idProduto, produtoRequest)
            .then((response) => {
                console.log('Produto alterado com sucesso.')
                alert('Produto alterado com sucesso!');
            })
            .catch((error) => {
                console.log('Erro ao alterar um produto.')
                alert('Erro ao alterar o produto.');
            });

        } else { // Cadastro
            axios.post("http://localhost:8080/api/produto", produtoRequest)
            .then((response) => {
                console.log('Produto cadastrado com sucesso.')
                alert('Produto cadastrado com sucesso!');
            })
            .catch((error) => {
                console.log('Erro ao incluir o produto.')
                alert('Erro ao cadastrar o produto.');
            });
        }
    }

    return (
        <div>
            <MenuSistema tela={'produto'} />
            <div style={{marginTop: '3%'}}>
                <Container textAlign='justified' >

                    {/* CABEÇALHOS DINÂMICOS */}
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
                            {/* BOTÃO VOLTAR COM LINK DINÂMICO */}
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