import axios from "axios";
import InputMask from "comigo-tech-react-input-mask";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Button,
    Container,
    Divider,
    Form,
    Icon,
    TextArea,
} from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";
import { notifyError, notifySuccess } from "../../views/util/Util";

export default function FormPromocao() {
  const [titulo, setTitulo] = useState("");
  const [regra, setRegra] = useState("");
  const [valorDesconto, setValorDesconto] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [promoValida, setPromoValida] = useState("");

  // ESTADOS PARA EDIÇÃO
  const { state } = useLocation();
  const [idPromocao, setIdPromocao] = useState();

  // useEffect para buscar os dados caso seja uma alteração
  useEffect(() => {
    if (state != null && state.id != null) {
      axios
        .get("http://localhost:8080/api/promocao/" + state.id)
        .then((response) => {
          setIdPromocao(response.data.id);
          setTitulo(response.data.titulo);
          setDataInicio(response.data.dataInicio);
          setDataFim(response.data.dataFim);
          setRegra(response.data.regra);
          setValorDesconto(response.data.valorDesconto);
          setPromoValida(response.data.promoValida);
        });
    }
  }, [state]);

  function salvar() {
    // CORREÇÃO: Variável intermediária para formatar a vírgula do decimal
    let valorFormatado = "";
    if (valorDesconto !== undefined && valorDesconto !== null) {
      valorFormatado = String(valorDesconto).replace(",", ".");
    }

    let promocaoRequest = {
      titulo: titulo,
      dataInicio: dataInicio,
      dataFim: dataFim,
      regra: regra,
      valorDesconto: valorFormatado, // Enviando o valor devidamente formatado
      promoValida: promoValida,
    };

    // LÓGICA DE DECISÃO: Alterar (PUT) ou Cadastrar (POST)
    if (idPromocao != null) {
      // Alteração
      axios
        .put(
          "http://localhost:8080/api/promocao/" + idPromocao,
          promocaoRequest,
        )
        .then((response) => {
          notifySuccess("Promoção alterada com sucesso!");
        })
        .catch((error) => {
          // Tratamento de erros do Spring Validation
          if (error.response.data.errors != undefined) {
            for (let i = 0; i < error.response.data.errors.length; i++) {
              notifyError(error.response.data.errors[i].defaultMessage);
            }
          } else {
            notifyError(error.response.data.message);
          }
        });
    } else {
      // Cadastro
      axios
        .post("http://localhost:8080/api/promocao", promocaoRequest)
        .then((response) => {
          notifySuccess("Promoção cadastrada com sucesso!");
        })
        .catch((error) => {
          // Tratamento de erros do Spring Validation
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
      <MenuSistema tela={"promocao"} />
      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          {/* CABEÇALHOS DINÂMICOS */}
          {idPromocao === undefined && (
            <h2>
              <span style={{ color: "darkgray" }}>
                {" "}
                Promoção &nbsp;
                <Icon name="angle double right" size="small" />{" "}
              </span>
              Cadastro
            </h2>
          )}
          {idPromocao !== undefined && (
            <h2>
              <span style={{ color: "darkgray" }}>
                {" "}
                Promoção &nbsp;
                <Icon name="angle double right" size="small" />{" "}
              </span>
              Alteração
            </h2>
          )}

          <Divider />
          <div style={{ marginTop: "4%" }}>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  required
                  fluid
                  label="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </Form.Group>

              <Form.Group widths="equal">
                <Form.Input fluid label="Regra">
                  <TextArea
                    maxLength="255"
                    placeholder="Informe a Regra da promoção"
                    value={regra}
                    onChange={(e) => setRegra(e.target.value)}
                  />
                </Form.Input>
              </Form.Group>

              <Form.Group>
                <Form.Input fluid label="Valor do Desconto" width={6}>
                  <InputMask
                    placeholder="Ex: 12.50"
                    value={valorDesconto}
                    onChange={(e) => setValorDesconto(e.target.value)}
                  />
                </Form.Input>

                <Form.Input fluid label="A partir de" width={6}>
                  {/* Adicionada a máscara de data aqui */}
                  <InputMask
                    mask="99/99/9999"
                    maskChar={null}
                    placeholder="Ex: 10/05/2026"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </Form.Input>

                <Form.Input fluid label="Terminando em" width={6}>
                  {/* Adicionada a máscara de data aqui */}
                  <InputMask
                    mask="99/99/9999"
                    maskChar={null}
                    placeholder="Ex: 25/05/2026"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </Form.Input>
              </Form.Group>
            </Form>

            <div style={{ marginTop: "4%" }}>
              {/* BOTÃO VOLTAR COM LINK DINÂMICO */}
              <Link to={"/list-promocao"}>
                <Button
                  type="button"
                  inverted
                  circular
                  icon
                  labelPosition="left"
                  color="orange"
                >
                  <Icon name="reply" />
                  Voltar
                </Button>
              </Link>

              <Button
                inverted
                circular
                icon
                labelPosition="left"
                color="blue"
                floated="right"
                onClick={() => salvar()}
              >
                <Icon name="save" />
                Salvar
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
