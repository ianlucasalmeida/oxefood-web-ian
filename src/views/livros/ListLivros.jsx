import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Divider,
  Header,
  Icon,
  Modal,
  Table,
} from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";

export default function ListLivro() {
  const [lista, setLista] = useState([]);

  // ESTADOS DO MODAL DE REMOÇÃO
  const [openModal, setOpenModal] = useState(false);
  const [idRemover, setIdRemover] = useState();

  // ESTADOS DO MODAL DE VISUALIZAÇÃO
  const [openModalVisualizar, setOpenModalVisualizar] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState({});

  useEffect(() => {
    carregarLista();
  }, []);

  function carregarLista() {
    axios.get("http://localhost:8080/api/livro").then((response) => {
      setLista(response.data);
    });
  }

  // --- FUNÇÕES DE REMOÇÃO ---
  function confirmaRemover(id) {
    setOpenModal(true);
    setIdRemover(id);
  }

  async function remover() {
    await axios
      .delete("http://localhost:8080/api/livro/" + idRemover)
      .then((response) => {
        console.log("Livro removido com sucesso.");
        // Após remover, recarrega a lista chamando a função
        carregarLista(); 
      })
      .catch((error) => {
        console.log("Erro ao remover o livro.");
      });
    setOpenModal(false);
  }

  // FUNÇÃO DE BUSCA PARA VISUALIZAÇÃO
  function visualizarDetalhes(id) {
    axios
      .get("http://localhost:8080/api/livro/" + id)
      .then((response) => {
        setLivroSelecionado(response.data); // Salva os dados completos do livro
        setOpenModalVisualizar(true); // Abre o modal
      })
      .catch((error) => {
        console.log("Erro ao buscar os detalhes do livro.");
      });
  }

  return (
    <div>
      <MenuSistema tela={"livro"} />
      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          <h2> Livro </h2>
          <Divider />

          <div style={{ marginTop: "4%" }}>
            <Button
              label="Novo"
              circular
              color="orange"
              icon="clipboard outline"
              floated="right"
              as={Link}
              to="/form-livros"
            />
            <br />
            <br />
            <br />

            <Table color="orange" sortable celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Título</Table.HeaderCell>
                  <Table.HeaderCell>Autor</Table.HeaderCell>
                  <Table.HeaderCell>Valor (R$)</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Ações</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {lista.map((livro) => (
                  <Table.Row key={livro.id}>
                    <Table.Cell>{livro.titulo}</Table.Cell>
                    <Table.Cell>{livro.autor}</Table.Cell>
                    <Table.Cell>{livro.valor}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {/*BOTÃO DE VISUALIZAÇÃO NA TABELA */}
                      <Button
                        circular
                        color="blue"
                        title="Clique aqui para visualizar os detalhes deste livro"
                        icon
                        onClick={() => visualizarDetalhes(livro.id)}
                      >
                        <Icon name="eye" />
                      </Button>{" "}
                      &nbsp;
                      <Button
                        inverted
                        circular
                        color="green"
                        title="Clique aqui para editar os dados deste livro"
                        icon
                      >
                        <Link
                          to="/form-livros"
                          state={{ id: livro.id }}
                          style={{ color: "green" }}
                        >
                          <Icon name="edit" />
                        </Link>
                      </Button>{" "}
                      &nbsp;
                      <Button
                        inverted
                        circular
                        color="red"
                        title="Clique aqui para remover este livro"
                        icon
                        onClick={(e) => confirmaRemover(livro.id)}
                      >
                        <Icon name="trash" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Container>
      </div>

      {/* MODAL DE REMOÇÃO */}
      <Modal
        basic
        onClose={() => setOpenModal(false)}
        onOpen={() => setOpenModal(true)}
        open={openModal}
      >
        <Header icon>
          <Icon name="trash" />
          <div style={{ marginTop: "5%" }}>
            {" "}
            Tem certeza que deseja remover esse registro?{" "}
          </div>
        </Header>
        <Modal.Actions>
          <Button
            basic
            color="red"
            inverted
            onClick={() => setOpenModal(false)}
          >
            <Icon name="remove" /> Não
          </Button>
          <Button color="green" inverted onClick={() => remover()}>
            <Icon name="checkmark" /> Sim
          </Button>
        </Modal.Actions>
      </Modal>

      {/* MODAL DE VISUALIZAÇÃO (Apresentação dos dados) */}
      <Modal
        size="small"
        open={openModalVisualizar}
        onClose={() => setOpenModalVisualizar(false)}
      >
        <Modal.Header>
          <Icon name="book" /> Detalhes do Livro
        </Modal.Header>
        <Modal.Content>
          <div style={{ fontSize: "1.1em", lineHeight: "1.6" }}>
            <p>
              <strong>ID no Banco:</strong> {livroSelecionado.id}
            </p>
            <p>
              <strong>Título:</strong> {livroSelecionado.titulo}
            </p>
            <p>
              <strong>Autor:</strong> {livroSelecionado.autor}
            </p>
            <p>
              <strong>Valor Unitário:</strong> R$ {livroSelecionado.valor}
            </p>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button color="blue" onClick={() => setOpenModalVisualizar(false)}>
            Fechar
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}