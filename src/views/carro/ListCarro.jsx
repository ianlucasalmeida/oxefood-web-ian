import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Divider, Header, Icon, Modal, Table } from "semantic-ui-react";
import MenuSistema from "../../MenuSistema";

export default function ListCarro() {
  const [lista, setLista] = useState([]);
  
  const [openModal, setOpenModal] = useState(false);
  const [idRemover, setIdRemover] = useState();
  
  const [openModalVisualizar, setOpenModalVisualizar] = useState(false);
  const [carroSelecionado, setCarroSelecionado] = useState({});

  useEffect(() => { carregarLista(); }, []);

  function carregarLista() {
    axios.get("http://localhost:8080/api/carro").then((response) => {
      setLista(response.data);
    });
  }

  function confirmaRemover(id) {
    setOpenModal(true);
    setIdRemover(id);
  }

  async function remover() {
    await axios.delete("http://localhost:8080/api/carro/" + idRemover)
      .then(() => { carregarLista(); })
      .catch(() => { console.log("Erro ao remover o carro."); });
    setOpenModal(false);
  }

  function visualizarDetalhes(id) {
    axios.get("http://localhost:8080/api/carro/" + id)
      .then((response) => {
        setCarroSelecionado(response.data);
        setOpenModalVisualizar(true);
      });
  }

  return (
    <div>
      <MenuSistema tela={"carro"} />
      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          <h2> Carro </h2>
          <Divider />

          <div style={{ marginTop: "4%" }}>
            <Button label="Novo" circular color="orange" icon="clipboard outline" floated="right" as={Link} to="/form-carro" />
            <br /><br /><br />

            <Table color="orange" sortable celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Modelo</Table.HeaderCell>
                  <Table.HeaderCell>Placa</Table.HeaderCell>
                  <Table.HeaderCell>Ano</Table.HeaderCell>
                  <Table.HeaderCell>Diária (R$)</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Ações</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {lista.map((carro) => (
                  <Table.Row key={carro.id}>
                    <Table.Cell>{carro.modelo}</Table.Cell>
                    <Table.Cell>{carro.placa}</Table.Cell>
                    <Table.Cell>{carro.ano}</Table.Cell>
                    <Table.Cell>R$ {carro.valorDiaria}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Button circular color="blue" icon onClick={() => visualizarDetalhes(carro.id)}>
                        <Icon name="eye" />
                      </Button> &nbsp;
                      <Button inverted circular color="green" icon as={Link} to="/form-carro" state={{ id: carro.id }}>
                        <Icon name="edit" />
                      </Button> &nbsp;
                      <Button inverted circular color="red" icon onClick={() => confirmaRemover(carro.id)}>
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

      <Modal basic onClose={() => setOpenModal(false)} open={openModal}>
        <Header icon><Icon name="trash" /> Tem certeza que deseja remover esse registro?</Header>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={() => setOpenModal(false)}><Icon name="remove" /> Não</Button>
          <Button color="green" inverted onClick={() => remover()}><Icon name="checkmark" /> Sim</Button>
        </Modal.Actions>
      </Modal>

      <Modal size="small" open={openModalVisualizar} onClose={() => setOpenModalVisualizar(false)}>
        <Modal.Header><Icon name="car" /> Detalhes do Carro</Modal.Header>
        <Modal.Content>
          <div style={{ fontSize: "1.1em", lineHeight: "1.6" }}>
            <p><strong>ID no Banco:</strong> {carroSelecionado.id}</p>
            <p><strong>Modelo:</strong> {carroSelecionado.modelo}</p>
            <p><strong>Placa:</strong> {carroSelecionado.placa}</p>
            <p><strong>Ano de Fabricação:</strong> {carroSelecionado.ano}</p>
            <p><strong>Valor da Diária:</strong> R$ {carroSelecionado.valorDiaria}</p>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button color="blue" onClick={() => setOpenModalVisualizar(false)}>Fechar</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}