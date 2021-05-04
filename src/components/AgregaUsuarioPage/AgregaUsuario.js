import axios from "axios";
import React, { Component } from "react";
import Cookies from "universal-cookie";
import md5 from "md5";

const cookies = new Cookies();

export default class AgregaUsuario extends Component {
  state = {
    nombre: "",
    apellido: "",
    correo: "",
    userName: "",
    contrasena: "",
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      nombre: this.state.nombre,
      apellido: this.state.apellido,
      correo: this.state.correo,
      userName: this.state.userName,
      contrasena: md5(this.state.contrasena),
    };
    const res = await axios.post(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/users`,
      newUser
    );
    console.log(res);
    console.log(res.data);
    if (Object.keys(res.data).length === 0) {
      alert("Este usuario ya existe");
    } else {
      cookies.set("id", res.data.id, { path: "/" });
      cookies.set("nombre", this.state.nombre, { path: "/" });
      cookies.set("apellido", this.state.apellido, { path: "/" });
      cookies.set("userName", this.state.userName, { path: "/" });
      cookies.set("correo", this.state.correo, { path: "/" });
      window.location.href = "/";
    }
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-6 mx-auto text-center">
          <div className="card">
            <div className="card-header">
              <h1>Crea tu cuenta</h1>
            </div>
            <div className="card-body">
              <form action="" onSubmit={this.onSubmit}>
                <div className="form-group">
                  <h5>Nombre</h5>
                  <input
                    className="form-control"
                    onChange={this.onChange}
                    type="text"
                    name="nombre"
                    value={this.state.nombre}
                  />
                </div>
                <div className="form-group">
                  <h5>Apellido</h5>
                  <input
                    className="form-control"
                    onChange={this.onChange}
                    type="text"
                    name="apellido"
                    value={this.state.apellido}
                  />
                </div>
                <div className="form-group">
                  <h5>Correo</h5>
                  <input
                    className="form-control"
                    onChange={this.onChange}
                    type="email"
                    name="correo"
                    value={this.state.correo}
                  />
                </div>
                <div className="form-group">
                  <h5>Nombre de Usuario</h5>
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
                    value={this.state.contrasena}
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
        </div>
      </div>
    );
  }
}
