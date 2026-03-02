import axios from "axios";
import InputMask from 'comigo-tech-react-input-mask';
import { useState } from "react";
import { Button, Container, Divider, Form, Icon, TextArea } from 'semantic-ui-react';

export default function FormProduto () {

    // 1. Criação dos estados para armazenar os dados digitados na tela
    const [titulo, setTitulo] = useState('');
    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valorUnitario, setValorUnitario] = useState('');
    const [tempoEntregaMinimo, setTempoEntregaMinimo] = useState('');
    const [tempoEntregaMaximo, setTempoEntregaMaximo] = useState('');

    // 2. Função responsável por montar o objeto e enviar ao backend
    function salvar() {
        let produtoRequest = {
            titulo: titulo,
            codigo: codigo, // ATENÇÃO: Se for usar este campo, ele deve existir na sua ProdutoRequest.java no backend
            descricao: descricao,
            valor: valorUnitario, // No backend chamamos apenas de 'valor'
            tempoEntregaMinimo: tempoEntregaMinimo,
            tempoEntregaMaximo: tempoEntregaMaximo
        }
    
        // Enviando o POST para a rota que configuramos no seu ProdutoController
        axios.post("http://localhost:8080/api/produto", produtoRequest)
        .then((response) => {
             console.log('Produto cadastrado com sucesso.')
             alert('Produto cadastrado com sucesso!');
        })
        .catch((error) => {
             console.log('Erro ao incluir o produto.')
             alert('Erro ao cadastrar o produto.');
        })
    }

    return (
        <div>
            <div style={{marginTop: '3%'}}>
                <Container textAlign='justified' >
                    <h2> <span style={{color: 'darkgray'}}> Produto &nbsp;<Icon name='angle double right' size="small" /> </span> Cadastro </h2>
                    <Divider />
                    <div style={{marginTop: '4%'}}>
                        <Form>
                            {/* Linha 1: Título e Código */}
                            <Form.Group widths='equal'>
                                <Form.Input
                                    required
                                    fluid
                                    label='Título'
                                    value={titulo}
                                    onChange={e => setTitulo(e.target.value)}
                                />

                                <Form.Input required fluid label='Código do Produto'>
                                    <InputMask
                                        required
                                        value={codigo}
                                        onChange={e => setCodigo(e.target.value)}
                                    /> 
                                </Form.Input>
                            </Form.Group>

                            {/* Linha 2: Descrição */}
                            <Form.Group widths='equal'>
                              <Form.Input fluid label='Descrição'>
                                  <TextArea 
                                      maxLength="255" 
                                      placeholder='Informe a descrição do produto' 
                                      value={descricao}
                                      onChange={e => setDescricao(e.target.value)}
                                  />
                              </Form.Input>
                            </Form.Group>
                            
                            {/* Linha 3: Valores e Tempos */}
                            <Form.Group>
                                <Form.Input fluid label='Valor Unitário' width={6}>
                                    <InputMask 
                                        placeholder="Ex: 12.50"
                                        value={valorUnitario}
                                        onChange={e => setValorUnitario(e.target.value)}
                                    /> 
                                </Form.Input>

                                <Form.Input fluid label='Tempo de Entrega Mínimo em Minutos' width={6}>
                                    <InputMask 
                                        placeholder="30"
                                        value={tempoEntregaMinimo}
                                        onChange={e => setTempoEntregaMinimo(e.target.value)}
                                    /> 
                                </Form.Input>

                                <Form.Input fluid label='Tempo de Entrega Máximo em Minutos' width={6}>
                                    <InputMask 
                                        placeholder="40"
                                        value={tempoEntregaMaximo}
                                        onChange={e => setTempoEntregaMaximo(e.target.value)}
                                    /> 
                                </Form.Input>
                            </Form.Group>
                        </Form>
                        
                        <div style={{marginTop: '4%'}}>
                            <Button
                                type="button"
                                inverted circular icon labelPosition='left' color='orange'
                            >
                                <Icon name='reply' />
                                Listar
                            </Button>
                                
                            {/* Vinculando o clique do botão à nossa função de salvar */}
                            <Button
                                inverted circular icon labelPosition='left' color='blue' floated='right'
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