import axios from 'axios';
import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { Link, useLocation } from 'react-router-dom';
import { Button, Container, Divider, Form, Icon, Message } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function FormCliente() {

    const { state } = useLocation();
    const [idCliente, setIdCliente] = useState();
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [foneCelular, setFoneCelular] = useState('');
    const [foneFixo, setFoneFixo] = useState('');
    const [mensagemSucesso, setMensagemSucesso] = useState('');

    useEffect(() => {
        if (state != null && state.id != null) {
            axios.get("http://localhost:8080/api/cliente/" + state.id)
                .then((response) => {
                    setIdCliente(response.data.id);
                    setNome(response.data.nome);
                    setCpf(response.data.cpf);
                    setEmail(response.data.email);
                    setDataNascimento(formatarData(response.data.dataNascimento));
                    setFoneCelular(response.data.foneCelular);
                    setFoneFixo(response.data.foneFixo);
                });
        }
    }, [state]);

    function formatarData(dataParam) {
        if (!dataParam) return '';
        let arrayData = dataParam.split('-');
        return arrayData[2] + '/' + arrayData[1] + '/' + arrayData[0];
    }

    // CORREÇÃO: Converte DD/MM/AAAA para AAAA-MM-DD antes de enviar para o Back-end
    function formatarDataParaEnvio(data) {
        if (!data) return null;
        let arrayData = data.split('/');
        return arrayData[2] + '-' + arrayData[1] + '-' + arrayData[0];
    }

    function salvar() {
        let dataRequest = {
            nome: nome,
            cpf: cpf,
            email: email,
            dataNascimento: formatarDataParaEnvio(dataNascimento), // Conversão aplicada
            foneCelular: foneCelular,
            foneFixo: foneFixo
        }

        if (idCliente != null) {
            axios.put("http://localhost:8080/api/cliente/" + idCliente, dataRequest)
                .then(() => setMensagemSucesso('Cliente alterado com sucesso!'))
                .catch((error) => console.error('Erro ao alterar cliente.', error));
        } else {
            axios.post("http://localhost:8080/api/cliente", dataRequest)
                .then(() => {
                    setMensagemSucesso('Cliente cadastrado com sucesso!');
                    limparFormulario();
                })
                .catch((error) => console.error('Erro ao incluir cliente.', error));
        }
    }

    function limparFormulario() {
        setNome(''); setCpf(''); setEmail(''); setDataNascimento(''); setFoneCelular(''); setFoneFixo('');
    }

    return (
        <div>
            <MenuSistema tela={'cliente'} />
            <div style={{ marginTop: '3%' }}>
                <Container textAlign='justified'>
                    <h2> {idCliente ? 'Alteração' : 'Cadastro'} de Cliente</h2>
                    <Divider />
                    {mensagemSucesso && (
                        <Message success icon='check' header='Sucesso!' content={mensagemSucesso} onDismiss={() => setMensagemSucesso('')} />
                    )}
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input required fluid label='Nome'>
                                <input value={nome} onChange={e => setNome(e.target.value)} />
                            </Form.Input>
                            <Form.Input required fluid label='CPF'>
                                <InputMask mask="999.999.999-99" value={cpf} onChange={e => setCpf(e.target.value)} />
                            </Form.Input>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input required fluid label='E-mail'>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                            </Form.Input>
                            <Form.Input fluid label='Data de Nascimento'>
                                <InputMask mask="99/99/9999" maskChar={null} value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />
                            </Form.Input>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input required fluid label='Fone Celular'>
                                <InputMask mask="(99) 99999-9999" value={foneCelular} onChange={e => setFoneCelular(e.target.value)} />
                            </Form.Input>
                            <Form.Input fluid label='Fone Fixo'>
                                <InputMask mask="(99) 9999-9999" value={foneFixo} onChange={e => setFoneFixo(e.target.value)} />
                            </Form.Input>
                        </Form.Group>
                    </Form>
                    <div style={{ marginTop: '4%' }}>
                        <Button as={Link} to='/list-cliente' type="button" inverted circular icon labelPosition='left' color='orange'>
                            <Icon name='reply' /> Voltar
                        </Button>
                        <Button inverted circular icon labelPosition='left' color='blue' floated='right' onClick={salvar}>
                            <Icon name='save' /> Salvar
                        </Button>
                    </div>
                </Container>
            </div>
        </div>
    );
}