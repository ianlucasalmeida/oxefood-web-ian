import axios from "axios";
import InputMask from "comigo-tech-react-input-mask";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Divider, Form, Icon } from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";
import { notifyError, notifySuccess } from "../../views/util/Util";

const tipoFuncionarioOptions = [
    { key: '1', text: 'Administrador', value: 'ADMINISTRADOR' },
    { key: '2', text: 'Gerente', value: 'GERENTE' },
    { key: '3', text: 'Operador', value: 'OPERADOR' },
];

export default function FormFuncionario() {

    const { state } = useLocation();
    const [idFuncionario, setIdFuncionario] = useState();

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [rg, setRg] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [foneCelular, setFoneCelular] = useState("");
    const [foneFixo, setFoneFixo] = useState("");
    const [tipo, setTipo] = useState("");

    useEffect(() => {
        if (state != null && state.id != null) {
            axios.get("http://localhost:8080/api/funcionario/" + state.id)
                .then((response) => {
                    setIdFuncionario(response.data.id);
                    setNome(response.data.nome);
                    setCpf(response.data.cpf);
                    setRg(response.data.rg);
                    setDataNascimento(formatarData(response.data.dataNascimento));
                    setFoneCelular(response.data.foneCelular);
                    setFoneFixo(response.data.foneFixo);
                    setTipo(response.data.tipo);
                });
        }
    }, [state]);

    function formatarData(dataParam) {
        if (!dataParam) return "";
        let arrayData = dataParam.split("-");
        return arrayData[2] + "/" + arrayData[1] + "/" + arrayData[0];
    }

    function salvar() {
        let funcionarioRequest = {
            nome: nome,
            cpf: cpf,
            rg: rg,
            dataNascimento: dataNascimento,
            foneCelular: foneCelular,
            foneFixo: foneFixo,
            tipo: tipo
        };

        if (idFuncionario != null) {
            axios.put("http://localhost:8080/api/funcionario/" + idFuncionario, funcionarioRequest)
                .then(() => notifySuccess("Funcionário alterado com sucesso!"))
                .catch((error) => notifyError(error.response.data.message));
        } else {
            axios.post("http://localhost:8080/api/funcionario", funcionarioRequest)
                .then(() => notifySuccess("Funcionário cadastrado com sucesso!"))
                .catch((error) => notifyError(error.response.data.message));
        }
    }

    return (
        <div>
            <MenuSistema tela={"funcionario"} />
            <div style={{ marginTop: "3%" }}>
                <Container textAlign="justified">
                    {idFuncionario === undefined ? (
                        <h2> <span style={{ color: "darkgray" }}> Funcionário &nbsp;<Icon name="angle double right" size="small" /> </span> Cadastro </h2>
                    ) : (
                        <h2> <span style={{ color: "darkgray" }}> Funcionário &nbsp;<Icon name="angle double right" size="small" /> </span> Alteração </h2>
                    )}

                    <Divider />

                    <div style={{ marginTop: "4%" }}>
                        <Form>
                            <Form.Group widths="equal">
                                <Form.Input required fluid label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                                <Form.Input required fluid label="CPF">
                                    <InputMask mask="999.999.999-99" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                                </Form.Input>
                                <Form.Input fluid label="RG" value={rg} onChange={(e) => setRg(e.target.value)} />
                            </Form.Group>

                            <Form.Group widths="equal">
                                <Form.Input fluid label="Data de Nascimento">
                                    <InputMask mask="99/99/9999" maskChar={null} value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} placeholder="DD/MM/AAAA" />
                                </Form.Input>
                                <Form.Input required fluid label="Fone Celular">
                                    <InputMask mask="(99) 99999-9999" value={foneCelular} onChange={(e) => setFoneCelular(e.target.value)} />
                                </Form.Input>
                                <Form.Input fluid label="Fone Fixo">
                                    <InputMask mask="(99) 9999-9999" value={foneFixo} onChange={(e) => setFoneFixo(e.target.value)} />
                                </Form.Input>
                            </Form.Group>

                            <Form.Group widths="equal">
                                <Form.Select
                                    required
                                    fluid
                                    label="Tipo de Funcionário"
                                    options={tipoFuncionarioOptions}
                                    placeholder="Selecione o Cargo"
                                    value={tipo}
                                    onChange={(e, { value }) => setTipo(value)}
                                />
                            </Form.Group>

                            <div style={{ marginTop: "4%" }}>
                                <Button as={Link} to="/list-funcionario" type="button" inverted circular icon labelPosition="left" color="orange">
                                    <Icon name="reply" /> Voltar
                                </Button>

                                <Button inverted circular icon labelPosition="left" color="blue" floated="right" onClick={() => salvar()}>
                                    <Icon name="save" /> Salvar
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Container>
            </div>
        </div>
    );
}