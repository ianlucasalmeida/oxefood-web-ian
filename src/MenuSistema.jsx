import { Link, useNavigate } from "react-router-dom";
import { Menu } from "semantic-ui-react";

export default function MenuSistema(props) {
  
  const navigate = useNavigate();

  function logout() {
    // Limpa o token do cofre do navegador
    localStorage.removeItem("token");
    // Redireciona o utilizador de volta para a porta trancada (Login)
    navigate("/");
  }

  return (
    <>
      <Menu inverted>
        <Menu.Item
          content="Home"
          active={props.tela === "home"}
          as={Link}
          to="/home"
        />
        <Menu.Item
          content="Cliente"
          active={props.tela === "cliente"}
          as={Link}
          to="/list-cliente"
        />
        <Menu.Item
          content="Produto"
          active={props.tela === "produto"}
          as={Link}
          to="/list-produto"
        />
        <Menu.Item
          content="Categoria de Produto"
          active={props.tela === "categoria"}
          as={Link}
          to="/list-categoria-produto"
        />
        {/* --- NOVA OPÇÃO DE PEDIDOS --- */}
        <Menu.Item
          content="Pedidos"
          active={props.tela === "pedido"}
          as={Link}
          to="/list-pedido"
        />
        <Menu.Item
          content="Entregador"
          active={props.tela === "entregador"}
          as={Link}
          to="/list-entregador"
        />
        <Menu.Item
          content="Livros"
          active={props.tela === "livros"}
          as={Link}
          to="/list-livros"
        />
        <Menu.Item
          content="Carro"
          active={props.tela === "carro"}
          as={Link}
          to="/list-carro"
        />
        <Menu.Item
          content="Promoção"
          active={props.tela === "promoção"}
          as={Link}
          to="/list-promocao"
        />

        {/* --- BOTÃO DE SAÍDA ALINHADO À DIREITA --- */}
        <Menu.Menu position="right">
          <Menu.Item
            name="Sair"
            icon="sign-out"
            onClick={logout}
            style={{ fontWeight: "bold", color: "red" }}
          />
        </Menu.Menu>
      </Menu>
    </>
  );
}