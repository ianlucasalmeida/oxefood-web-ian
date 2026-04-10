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

export default function ListPromocao() {
  const [lista, setLista] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [idRemover, setIdRemover] = useState();

  const [openModalVisualizar, setOpenModalVisualizar] = useState(false);
  const [promocaoSelecionada, setPromocaoSelecionada] = useState({});

  useEffect(() => {
    carregarLista();
  }, []);

  function carregarLista() {
    axios.get("http://localhost:8080/api/promocao").then((response) => {
      setLista(response.data);
    });
  }

  // Função para garantir que a data apareça como DD/MM/YYYY [cite: 378, 379]
  function formatarData(dataParam) {
    if (dataParam === null || dataParam === "" || dataParam === undefined) {
      return "";
    }
    let arrayData = dataParam.split("-");
    return arrayData[2] + "/" + arrayData[1] + "/" + arrayData[0];
  }

  function confirmaRemover(id) {
    setOpenModal(true);
    setIdRemover(id);
  }

  async function remover() {
    await axios
      .delete("http://localhost:8080/api/promocao/" + idRemover)
      .then(() => {
        carregarLista();
      })
      .catch(() => {
        console.log("Erro ao remover a promoção.");
      });
    setOpenModal(false);
  }

  function visualizarDetalhes(id) {
    axios.get("http://localhost:8080/api/promocao/" + id).then((response) => {
      setPromocaoSelecionada(response.data);
      setOpenModalVisualizar(true);
    });
  }

  // RESPOSTA DA QUESTÃO 05: Função que inverte o status de Validade
  // RESPOSTA DA QUESTÃO 05: Função que inverte o status de Validade
  function alternarStatus(promocao) {
    let promocaoRequest = {
      titulo: promocao.titulo,
      // CORREÇÃO: Aplicando a formatação antes de devolver pro Java!
      dataInicio: formatarData(promocao.dataInicio),
      dataFim: formatarData(promocao.dataFim),
      regra: promocao.regra,
      valorDesconto: promocao.valorDesconto,
      promoValida: !promocao.promoValida,
    };

    axios
      .put("http://localhost:8080/api/promocao/" + promocao.id, promocaoRequest)
      .then(() => {
        carregarLista();
      })
      .catch((error) => {
        console.log("Erro ao alterar o status da promoção.");
      });
  }

  return (
    <div>
      <MenuSistema tela={"promocao"} />
      <div style={{ marginTop: "3%" }}>
        <Container textAlign="justified">
          <h2> Promoção </h2>
          <Divider />

          <div style={{ marginTop: "4%" }}>
            <Button
              label="Novo"
              circular
              color="orange"
              icon="clipboard outline"
              floated="right"
              as={Link}
              to="/form-promocao"
            />
            <br />
            <br />
            <br />

            <Table color="orange" sortable celled>
              <Table.Header>
                <Table.Row>
                  {/* RESPOSTA DA QUESTÃO 02: Apenas os 4 campos solicitados  */}
                  <Table.HeaderCell>Título</Table.HeaderCell>
                  <Table.HeaderCell>Data de Início</Table.HeaderCell>
                  <Table.HeaderCell>Data de Fim</Table.HeaderCell>
                  <Table.HeaderCell>Válida?</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Ações</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {lista.map((promocao) => (
                  <Table.Row key={promocao.id}>
                    <Table.Cell>{promocao.titulo}</Table.Cell>
                    <Table.Cell>{formatarData(promocao.dataInicio)}</Table.Cell>
                    <Table.Cell>{formatarData(promocao.dataFim)}</Table.Cell>
                    <Table.Cell>
                      {promocao.promoValida ? "Sim" : "Não"}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Button
                        circular
                        color="blue"
                        title="Ver Detalhes"
                        icon
                        onClick={() => visualizarDetalhes(promocao.id)}
                      >
                        <Icon name="eye" />
                      </Button>{" "}
                      &nbsp;
                      {/* RESPOSTA DA QUESTÃO 05: Botão de Ativar/Desativar  */}
                      <Button
                        inverted
                        circular
                        color={promocao.promoValida ? "orange" : "teal"}
                        title="Ativar/Desativar Promoção"
                        icon
                        onClick={() => alternarStatus(promocao)}
                      >
                        <Icon name={promocao.promoValida ? "ban" : "check"} />
                      </Button>{" "}
                      &nbsp;
                      <Button
                        inverted
                        circular
                        color="green"
                        title="Editar"
                        icon
                        as={Link}
                        to="/form-promocao"
                        state={{ id: promocao.id }}
                      >
                        <Icon name="edit" />
                      </Button>{" "}
                      &nbsp;
                      <Button
                        inverted
                        circular
                        color="red"
                        title="Remover"
                        icon
                        onClick={() => confirmaRemover(promocao.id)}
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
      <Modal basic onClose={() => setOpenModal(false)} open={openModal}>
        <Header icon>
          <Icon name="trash" /> Tem certeza que deseja remover esse registro?
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

      {/* RESPOSTA DA QUESTÃO 06: Modal de Visualização completo e formatado [cite: 375, 376] */}
      <Modal
        size="small"
        open={openModalVisualizar}
        onClose={() => setOpenModalVisualizar(false)}
      >
        <Modal.Header>
          <Icon name="tag" /> Detalhamento da Promoção
        </Modal.Header>
        <Modal.Content>
          <div style={{ fontSize: "1.1em", lineHeight: "1.6" }}>
            <p>
              <strong>Título:</strong> {promocaoSelecionada.titulo}
            </p>
            <p>
              <strong>Data de Início:</strong>{" "}
              {formatarData(promocaoSelecionada.dataInicio)}
            </p>
            <p>
              <strong>Data de Fim:</strong>{" "}
              {formatarData(promocaoSelecionada.dataFim)}
            </p>
            <p>
              <strong>Regra:</strong> {promocaoSelecionada.regra}
            </p>
            <p>
              <strong>Valor do Desconto:</strong> R${" "}
              {promocaoSelecionada.valorDesconto}
            </p>
            <p>
              <strong>Promoção Válida:</strong>{" "}
              {promocaoSelecionada.promoValida ? "Sim" : "Não"}
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
