import InputMask from 'comigo-tech-react-input-mask';
import React, { useState } from "react";
import { Button, Container, Divider, Form, Icon } from 'semantic-ui-react';

const ufOptions = [
    { key: 'pe', text: 'Pernambuco', value: 'PE' },
    { key: 'sp', text: 'São Paulo', value: 'SP' },
    { key: 'rj', text: 'Rio de Janeiro', value: 'RJ' },
    // Adicione os demais estados aqui
];

export default function FormCliente() {
    const [ativo, setAtivo] = useState('nao'); // Estado para controlar o radio button

    return (
        <div>
            <div style={{ marginTop: '3%' }}>
                <Container textAlign='justified'>
                    <h2> 
                        <span style={{ color: 'darkgray' }}> 
                            Entregador &nbsp;<Icon name='angle double right' size="small" /> 
                        </span> 
                        Cadastro 
                    </h2>

                    <Divider />

                    <div style={{ marginTop: '4%' }}>
                        <Form>
                            {/* Linha 1: Nome, CPF, RG */}
                            <Form.Group>
                                <Form.Input required fluid label='Nome' width={8} />

                                <Form.Input required fluid label='CPF' width={4}>
                                    <InputMask required mask="999.999.999-99" />
                                </Form.Input>

                                <Form.Input fluid label='RG' width={4} />
                            </Form.Group>
                            
                            {/* Linha 2: DT Nascimento, Fone Celular, Fone Fixo, QTD, Valor */}
                            <Form.Group>
                                <Form.Input fluid label='DT Nascimento' width={3}>
                                    <InputMask 
                                        mask="99/99/9999" 
                                        maskChar={null}
                                        placeholder="Ex: 20/03/1985"
                                    /> 
                                </Form.Input>

                                <Form.Input required fluid label='Fone Celular' width={4}>
                                    <InputMask mask="(99) 99999-9999" /> 
                                </Form.Input>

                                <Form.Input fluid label='Fone Fixo' width={3}>
                                    <InputMask mask="(99) 9999-9999" /> 
                                </Form.Input>

                                <Form.Input fluid label='QTD Entregas Realizadas' width={3} />

                                <Form.Input fluid label='Valor Por Frete' width={3} />
                            </Form.Group>

                            {/* Linha 3: Rua, Número */}
                            <Form.Group>
                                <Form.Input fluid label='Rua' width={13} />
                                <Form.Input fluid label='Número' width={3} />
                            </Form.Group>

                            {/* Linha 4: Bairro, Cidade, CEP */}
                            <Form.Group>
                                <Form.Input fluid label='Bairro' width={6} />
                                <Form.Input fluid label='Cidade' width={7} />
                                <Form.Input fluid label='CEP' width={3}>
                                    <InputMask mask="99.999-999" />
                                </Form.Input>
                            </Form.Group>

                            {/* Linha 5: UF */}
                            <Form.Select 
                                fluid 
                                label='UF' 
                                options={ufOptions} 
                                placeholder='Selecione' 
                            />

                            {/* Linha 6: Complemento */}
                            <Form.Input fluid label='Complemento' />

                            {/* Linha 7: Ativo */}
                            <Form.Group inline>
                                <label>Ativo: </label>
                                <Form.Radio
                                    label='Sim'
                                    value='sim'
                                    checked={ativo === 'sim'}
                                    onChange={() => setAtivo('sim')}
                                />
                                <Form.Radio
                                    label='Não'
                                    value='nao'
                                    checked={ativo === 'nao'}
                                    onChange={() => setAtivo('nao')}
                                />
                            </Form.Group>

                        </Form>
                        
                        {/* Botões */}
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
                                Voltar
                            </Button>
                                
                            <Button
                                inverted
                                circular
                                icon
                                labelPosition='left'
                                color='blue'
                                floated='right'
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