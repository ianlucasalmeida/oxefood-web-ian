import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Divider, Form, Icon } from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";
import { notifyError, notifySuccess } from "../../views/util/Util";

export default function FormCarro() {
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [ano, setAno] = useState('');
  const [valorDiaria, setValorDiaria] = useState('');

  const { state } = useLocation();
  const [idCarro, setIdCarro] = useState();

  useEffect(() => {
    if (state != null && state.id != null) {
      axios
        .get("http://localhost:8080/api/carro/" + state.id)
        .then((response) => {
          setIdCarro(response.data.id);
          setModelo(response.data.modelo);
          setPlaca(response.data.placa);
          setAno(response.data.ano);
          setValorDiaria(response.data.valorDiaria);
        });
    }
  }, [state]);

  function salvar() {
    let valorComPonto = '';
    if (valorDiaria !== undefined && valorDiaria !== null) {
        valorComPonto = String(valorDiaria).replace(',', '.');
    }

    let carroRequest = {
      modelo: modelo,
      placa: placa,
      ano: ano,
      valorDiaria: valorComPonto,
    };

    if (idCarro != null) {
      axios.put("http://localhost:8080/api/carro/" + idCarro, carroRequest)
        .then(() => { notifySuccess("Carro alterado com sucesso."); })
        .catch((error) => {
          if (error.response.data.errors != undefined) {
            for (let i = 0; i < error.response.data.errors.length; i++) {
              notifyError(error.response.data.errors[i].defaultMessage);
            }
          } else {
            notifyError(error.response.data.message);
          }
        });
    } else {
      axios.post("http://localhost:8080/api/carro", carroRequest)
        .then(() => { notifySuccess("Carro cadastrado com sucesso."); })
        .catch((error) => {
          if (error.response.data.errors != undefined) {
            for (let i = 0; i < error.response.data.errors.length; i++) {
              notifyError(error.response.data.errors[i].defaultMessage);
            }
          } else {
            notifyError(error.response.data.message);
          }
        });
    }
  }

  return (
    <div>
      <MenuSistema tela={"carro"} />
      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          <h2>
            <span style={{ color: "darkgray" }}>
              Carro &nbsp;<Icon name="angle double right" size="small" />
            </span>
            {idCarro === undefined ? " Cadastro" : " Alteração"}
          </h2>
          <Divider />

          <div style={{ marginTop: "4%" }}>
            <Form>
              <Form.Group widths="equal">
                <Form.Input required fluid label="Modelo" placeholder="Ex: Honda Civic" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                <Form.Input required fluid label="Placa" placeholder="Ex: ABC-1234" value={placa} onChange={(e) => setPlaca(e.target.value)} />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input required fluid type="number" label="Ano de Fabricação" placeholder="Ex: 2020" value={ano} onChange={(e) => setAno(e.target.value)} />
                <Form.Input required fluid label="Valor da Diária (R$)" placeholder="Ex: 150,00" value={valorDiaria} onChange={(e) => setValorDiaria(e.target.value)} />
              </Form.Group>
            </Form>

            <div style={{ marginTop: "4%" }}>
              <Link to={"/list-carro"}>
                <Button type="button" inverted circular icon labelPosition="left" color="orange">
                  <Icon name="reply" /> Voltar
                </Button>
              </Link>
              <Button inverted circular icon labelPosition="left" color="blue" floated="right" onClick={() => salvar()}>
                <Icon name="save" /> Salvar
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}