import axios from "axios";
import InputMask from 'comigo-tech-react-input-mask';
import { useState } from "react";
import { Button, Container, Divider, Form, Icon } from 'semantic-ui-react';
const ufOptions = [
    { key: 'ac', text: 'Acre', value: 'AC' },
    { key: 'al', text: 'Alagoas', value: 'AL' },
    { key: 'ap', text: 'Amapá', value: 'AP' },
    { key: 'am', text: 'Amazonas', value: 'AM' },
    { key: 'ba', text: 'Bahia', value: 'BA' },
    { key: 'ce', text: 'Ceará', value: 'CE' },
    { key: 'df', text: 'Distrito Federal', value: 'DF' },
    { key: 'es', text: 'Espírito Santo', value: 'ES' },
    { key: 'go', text: 'Goiás', value: 'GO' },
    { key: 'ma', text: 'Maranhão', value: 'MA' },
    { key: 'mt', text: 'Mato Grosso', value: 'MT' },
    { key: 'ms', text: 'Mato Grosso do Sul', value: 'MS' },
    { key: 'mg', text: 'Minas Gerais', value: 'MG' },
    { key: 'pa', text: 'Pará', value: 'PA' },
    { key: 'pb', text: 'Paraíba', value: 'PB' },
    { key: 'pr', text: 'Paraná', value: 'PR' },
    { key: 'pe', text: 'Pernambuco', value: 'PE' },
    { key: 'pi', text: 'Piauí', value: 'PI' },
    { key: 'rj', text: 'Rio de Janeiro', value: 'RJ' },
    { key: 'rn', text: 'Rio Grande do Norte', value: 'RN' },
    { key: 'rs', text: 'Rio Grande do Sul', value: 'RS' },
    { key: 'ro', text: 'Rondônia', value: 'RO' },
    { key: 'rr', text: 'Roraima', value: 'RR' },
    { key: 'sc', text: 'Santa Catarina', value: 'SC' },
    { key: 'se', text: 'Sergipe', value: 'SE' },
    { key: 'sp', text: 'São Paulo', value: 'SP' },
    { key: 'to', text: 'Tocantins', value: 'TO' }
];

export default function FormEntregador() { // <-- Nome ajustado

    // PASSO 2: Criando os estados para cada campo
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [foneCelular, setFoneCelular] = useState('');
    const [foneFixo, setFoneFixo] = useState('');
    const [qtdEntregasRealizadas, setQtdEntregasRealizadas] = useState('');
    const [valorFrete, setValorFrete] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [cep, setCep] = useState('');
    const [uf, setUf] = useState('');
    const [complemento, setComplemento] = useState('');
    
    // Mudamos para booleano (true/false) para casar perfeitamente com o Java
    const [ativo, setAtivo] = useState(false); 

    // PASSO 3: A função de integração com o Backend
    function salvar() {
        // TRATAMENTO: Trocando a vírgula por ponto para não dar erro 400 no Double do Java
        let valorFreteComPonto = valorFrete.replace(',', '.');

        let entregadorRequest = {
            nome: nome,
            cpf: cpf,
            rg: rg,
            dataNascimento: dataNascimento,
            foneCelular: foneCelular,
            foneFixo: foneFixo,
            qtdEntregasRealizadas: qtdEntregasRealizadas,
            valorFrete: valorFreteComPonto, // <-- Enviando o valor tratado
            rua: rua,
            numero: numero,
            bairro: bairro,
            cidade: cidade,
            cep: cep,
            uf: uf,
            complemento: complemento,
            ativo: ativo
        };

        // Requisição POST para o Controller do Entregador
        axios.post("http://localhost:8080/api/entregador", entregadorRequest)
        .then((response) => {
             console.log('Entregador cadastrado com sucesso.')
             alert('Entregador cadastrado com sucesso!');
        })
        .catch((error) => {
             console.log('Erro ao incluir o entregador.')
             alert('Erro ao cadastrar o entregador. Verifique o console.');
        });
    }

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
                            {/* PASSO 4: Ligando os inputs aos estados (value e onChange) */}
                            <Form.Group>
                                <Form.Input 
                                    required fluid label='Nome' width={8} 
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                />

                                <Form.Input required fluid label='CPF' width={4}>
                                    <InputMask 
                                        required mask="999.999.999-99" 
                                        value={cpf}
                                        onChange={e => setCpf(e.target.value)}
                                    />
                                </Form.Input>

                                <Form.Input 
                                    fluid label='RG' width={4} 
                                    value={rg}
                                    onChange={e => setRg(e.target.value)}
                                />
                            </Form.Group>
                            
                            <Form.Group>
                                <Form.Input fluid label='DT Nascimento' width={3}>
                                    <InputMask 
                                        mask="99/99/9999" 
                                        maskChar={null}
                                        placeholder="Ex: 20/03/1985"
                                        value={dataNascimento}
                                        onChange={e => setDataNascimento(e.target.value)}
                                    /> 
                                </Form.Input>

                                <Form.Input required fluid label='Fone Celular' width={4}>
                                    <InputMask 
                                        mask="(99) 99999-9999" 
                                        value={foneCelular}
                                        onChange={e => setFoneCelular(e.target.value)}
                                    /> 
                                </Form.Input>

                                <Form.Input fluid label='Fone Fixo' width={3}>
                                    <InputMask 
                                        mask="(99) 9999-9999" 
                                        value={foneFixo}
                                        onChange={e => setFoneFixo(e.target.value)}
                                    /> 
                                </Form.Input>

                                <Form.Input 
                                    fluid label='QTD Entregas Realizadas' width={3} 
                                    value={qtdEntregasRealizadas}
                                    onChange={e => setQtdEntregasRealizadas(e.target.value)}
                                />

                                <Form.Input 
                                    fluid label='Valor Por Frete' width={3} 
                                    placeholder="Ex: 15,50"
                                    value={valorFrete}
                                    onChange={e => setValorFrete(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Input 
                                    fluid label='Rua' width={13} 
                                    value={rua}
                                    onChange={e => setRua(e.target.value)}
                                />
                                <Form.Input 
                                    fluid label='Número' width={3} 
                                    value={numero}
                                    onChange={e => setNumero(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Input 
                                    fluid label='Bairro' width={6} 
                                    value={bairro}
                                    onChange={e => setBairro(e.target.value)}
                                />
                                <Form.Input 
                                    fluid label='Cidade' width={7} 
                                    value={cidade}
                                    onChange={e => setCidade(e.target.value)}
                                />
                                <Form.Input fluid label='CEP' width={3}>
                                    <InputMask 
                                        mask="99.999-999" 
                                        value={cep}
                                        onChange={e => setCep(e.target.value)}
                                    />
                                </Form.Input>
                            </Form.Group>

                            <Form.Select 
                                fluid 
                                label='UF' 
                                options={ufOptions} 
                                placeholder='Selecione'
                                value={uf}
                                /* O Select do Semantic UI requer essa sintaxe para pegar o valor */
                                onChange={(e, { value }) => setUf(value)} 
                            />

                            <Form.Input 
                                fluid label='Complemento' 
                                value={complemento}
                                onChange={e => setComplemento(e.target.value)}
                            />

                            <Form.Group inline>
                                <label>Ativo: </label>
                                <Form.Radio
                                    label='Sim'
                                    checked={ativo === true}
                                    onChange={() => setAtivo(true)}
                                />
                                <Form.Radio
                                    label='Não'
                                    checked={ativo === false}
                                    onChange={() => setAtivo(false)}
                                />
                            </Form.Group>

                        </Form>
                        
                        <div style={{ marginTop: '4%' }}>
                            <Button
                                type="button"
                                inverted circular icon labelPosition='left' color='orange'
                            >
                                <Icon name='reply' />
                                Voltar
                            </Button>
                                
                            <Button
                                inverted circular icon labelPosition='left' color='blue' floated='right'
                                onClick={() => salvar()} // <-- Acionando a função ao clicar
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