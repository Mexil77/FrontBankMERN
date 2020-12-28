import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default class Navigation extends Component {
  state = {
    user: false,
  };

  componentDidMount() {
    if (cookies.get("id")) {
      this.setState({
        user: true,
      });
    } else {
      this.setState({
        user: false,
      });
    }
  }

  cerrarSesion = async () => {
    cookies.remove("id", { path: "/" });
    cookies.remove("nombre", { path: "/" });
    cookies.remove("apellido", { path: "/" });
    cookies.remove("userName", { path: "/" });
    cookies.remove("correo", { path: "/" });
    await axios.get(`${process.env.REACT_APP_URI_PREFIX_WEB}/api/users`);
    window.location.to = "/";
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Home
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {this.state.user ? (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <Link className="nav-link" to="/inversionistas">
                    Inversionistas
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link
                    className="nav-link"
                    to="/listaCargosInversiones/inversiones"
                  >
                    Inversiones
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Tarjetas
                  </Link>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link
                      className="nav-link"
                      to="/listaCargosTarjetasVenta/ventas"
                    >
                      Venta
                    </Link>
                    <Link
                      className="nav-link"
                      to="/listaCargosTarjetasDeuda/banco"
                    >
                      Deuda
                    </Link>
                  </div>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Clientes
                  </Link>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link className="nav-link" to="/clientesInv/inv">
                      Inversionistas
                    </Link>
                    <Link className="nav-link" to="/clientesBanco/banco">
                      Banco
                    </Link>
                  </div>
                </li>
                <li className="nav-item active">
                  <Link
                    onClick={this.cerrarSesion}
                    className="nav-link btn btn-danger"
                    to="/"
                  >
                    Cerrar sesion
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <Link className="nav-link btn btn-success" to="/nuevoUsuario">
                    Crea usuario
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    );
  }
}
