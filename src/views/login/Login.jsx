import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { isUserLoggedIn, registerSuccessfulLoginForJwt } from '../util/AuthenticationService';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    // Redireciona automaticamente se o usuário já estiver logado
    useEffect(() => {
        if (isUserLoggedIn()) {
            navigate('/home');
        }
    }, [navigate]);

    function efetuarLogin() {
        setErro('');

        const authRequest = {
            username: username,
            password: password
        };

        axios.post('http://localhost:8080/api/login', authRequest)
            .then((response) => {
                // Ajuste conforme o formato do seu JSON de resposta (ex: response.data.token)
                const tokenJwt = response.data.token || response.data;
                
                if (tokenJwt) {
                    // Utiliza o método do serviço para registrar o login corretamente
                    registerSuccessfulLoginForJwt(tokenJwt, new Date().getTime() + 3600000);
                    navigate('/home');
                } else {
                    setErro('Erro ao processar o token recebido.');
                }
            })
            .catch((error) => {
                console.error('Erro de autenticação:', error);
                if (error.code === 'ERR_NETWORK') {
                    setErro('Servidor não encontrado. Verifique se o Spring Boot está rodando.');
                } else {
                    setErro('E-mail ou senha incorretos.');
                }
            });
    }

    return (
        <Grid textAlign='center' style={{ height: '100vh', backgroundColor: '#f4f4f4' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='orange' textAlign='center'>
                    Acesso ao Sistema
                </Header>
                <Form size='large'>
                    <Segment stacked>
                        <Form.Input 
                            fluid 
                            icon='user' 
                            iconPosition='left' 
                            placeholder='E-mail' 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Senha'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* type="button" previne o reload do formulário */}
                        <Button color='orange' fluid size='large' type='button' onClick={efetuarLogin}>
                            Entrar
                        </Button>
                    </Segment>
                </Form>
                
                {erro && (
                    <Message negative>
                        <p>{erro}</p>
                    </Message>
                )}
            </Grid.Column>
        </Grid>
    );
}