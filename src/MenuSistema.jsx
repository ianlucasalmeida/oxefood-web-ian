import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

export default function MenuSistema(props) {
  return (
    <>
      <Menu inverted>
        <Menu.Item
          content="Home"
          active={props.tela === "home"}
          as={Link}
          to="/"
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
              active={props.tela ==="promoção"}
              as={Link}
              to="/list-promocao"
          />

      </Menu>
    </>
  );
}
