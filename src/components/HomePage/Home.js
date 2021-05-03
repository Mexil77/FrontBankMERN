import React, { Component } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import md5 from "md5";

const cookies = new Cookies();

export default class Home extends Component {
  state = {
    userName: "",
    contrasena: "",
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

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const contrasena = { contrasena: md5(this.state.contrasena) };
    const res = await axios.post(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/users/${this.state.userName}`,
      contrasena
    );
    console.log(res.data);
    if (Object.keys(res.data).length === 0) {
      e.preventDefault();
      alert("Usuario o contraseña estan incorrectos");
    } else {
      cookies.set("id", res.data._id, { path: "/" });
      cookies.set("nombre", res.data.nombre, { path: "/" });
      cookies.set("apellido", res.data.apellido, { path: "/" });
      cookies.set("userName", res.data.userName, { path: "/" });
      cookies.set("correo", res.data.correo, { path: "/" });
      window.location.href = "/listaCargosTarjetasVenta/ventas";
    }
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-4 mx-auto text-center">
          {this.state.user ? (
            <h1>Bienvenido {cookies.get("userName")}</h1>
          ) : (
            <div className="card">
              <div className="card-header">
                <h1>Inicia sesion</h1>
              </div>
              <div className="card-body">
                <form action="" onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <h5>Usuario</h5>
                    <input
                      className="form-control"
                      onChange={this.onChange}
                      type="text"
                      name="userName"
                      value={this.state.userName}
                    />
                  </div>
                  <div className="form-group">
                    <h5>Contraseña</h5>
                    <input
                      className="form-control"
                      onChange={this.onChange}
                      type="password"
                      name="contrasena"
                      value={this.state.password}
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-success btn-block" type="submit">
                      Inicia sesion
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
