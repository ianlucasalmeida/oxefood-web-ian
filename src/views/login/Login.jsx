import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    
    // Hook do React Router para redirecionar o utilizador após o login
    const navigate = useNavigate();

    function efetuarLogin() {
        setErro(''); // Limpa erros anteriores

        let authRequest = {
            username: username,
            password: password
        };

        axios.post('http://localhost:8080/api/login', authRequest)
        .then((response) => {
            // Se o login for bem sucedido, o back-end devolve o Token JWT
            const tokenJwt = response.data.token;
            
            // Salvamos esse token no "cofre" do navegador (localStorage)
            localStorage.setItem('token', tokenJwt);
            
            // Redirecionamos o utilizador para a tela inicial do sistema (ex: lista de produtos)
            navigate('/list-produto'); 
        })
        .catch((error) => {
            // Se as credenciais estiverem erradas (403 Forbidden), exibimos a mensagem
            setErro('E-mail ou senha incorretos. Tente novamente.');
            console.error('Erro de autenticação:', error);
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
                            placeholder='E-mail (ex: admin@oxefood.com)' 
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

                        <Button color='orange' fluid size='large' onClick={() => efetuarLogin()}>
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