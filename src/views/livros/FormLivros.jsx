import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Divider, Form, Icon } from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";
import { notifyError, notifySuccess } from "../../views/util/Util";

export default function FormLivro() {
  const [titulo, setTitulo] = useState();
  const [autor, setAutor] = useState();
  const [valor, setValor] = useState();

  const { state } = useLocation();
  const [idLivro, setIdLivro] = useState();

  useEffect(() => {
    if (state != null && state.id != null) {
      axios
        .get("http://localhost:8080/api/livro/" + state.id)
        .then((response) => {
          setIdLivro(response.data.id);
          setTitulo(response.data.titulo);
          setAutor(response.data.autor);
          setValor(response.data.valor);
        });
    }
  }, [state]);

  function salvar() {
    // Tratamento para garantir que o Java não dê erro com a vírgula do decimal
    let valorComPonto = '';
    if (valor !== undefined && valor !== null) {
        valorComPonto = String(valor).replace(',', '.');
    }

    let livroRequest = {
      titulo: titulo,
      autor: autor,
      valor: valorComPonto,
    };

    if (idLivro != null) {
      // Alteração:
      axios
        .put("http://localhost:8080/api/livro/" + idLivro, livroRequest)
        .then((response) => {
          notifySuccess("Livro alterado com sucesso.");
        })
        .catch((error) => {
          // Mantendo a lógica de exibição de erros do Spring Validation para a edição também
          if (error.response.data.errors != undefined) {
            for (let i = 0; i < error.response.data.errors.length; i++) {
              notifyError(error.response.data.errors[i].defaultMessage);
            }
          } else {
            notifyError(error.response.data.message);
          }
        });
    } else {
      // Cadastro:
      axios
        .post("http://localhost:8080/api/livro", livroRequest)
        .then((response) => {
          notifySuccess("Livro cadastrado com sucesso.");
        })
        .catch((error) => {
          // Lógica de captura de múltiplos erros vindos do Back-end com o Toastify
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
      <MenuSistema tela={"livro"} />

      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          {idLivro === undefined && (
            <h2>
              {" "}
              <span style={{ color: "darkgray" }}>
                {" "}
                Livro &nbsp;
                <Icon name="angle double right" size="small" />{" "}
              </span>{" "}
              Cadastro
            </h2>
          )}
          {idLivro != undefined && (
            <h2>
              {" "}
              <span style={{ color: "darkgray" }}>
                {" "}
                Livro &nbsp;
                <Icon name="angle double right" size="small" />{" "}
              </span>{" "}
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
                  maxLength="100"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />

                <Form.Input 
                  fluid 
                  label="Autor"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                />

                <Form.Input 
                  fluid 
                  label="Valor Unitário (R$)"
                  placeholder="Ex: 45,50"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </Form.Group>
            </Form>

            <div style={{ marginTop: "4%" }}>
              <Link to={"/list-livros"}>
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