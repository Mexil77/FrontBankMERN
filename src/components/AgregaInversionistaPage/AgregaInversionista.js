import React, { Component } from "react";
import axios from "axios";

export default class AgregaInversionista extends Component {
  state = {
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    ahorrado: 0,
  };

  /* imporimeEstado = () => {
    console.log(this.state);
  }; */

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const newInversionista = {
      nombre: this.state.nombre,
      apellido: this.state.apellido,
      correo: this.state.correo,
      telefono: this.state.telefono,
      ahorrado: this.state.ahorrado,
    };

    await axios.post(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/inversionistas`,
      newInversionista
    );
    window.location.href = "/inversionistas";
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-header">
              <h1>nuevo inversionista</h1>
            </div>
            <div className="card-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <h5>Nombre</h5>
                  <input
                    className="form-control"
                    onChange={this.onChange}
                    value={this.state.nombre}
                    type="text"
                    name="nombre"
                  />
                </div>
                <div className="form-group">
                  <h5>Apellido</h5>
                  <input
                    className="form-control"
                    onChange={this.onChange}
                    value={this.state.apellido}
                    type="text"
                    name="apellido"
                  />
                </div>
                <div className="form-group">
                  <h5>Correo</h5>
                  <input
                    className="form-control"
                    onChange={this.onChange}
                    value={this.state.correo}
                    type="email"
                    name="correo"
                  />
                </div>
                <div className="form-group">
                  <h5>Telefono</h5>
                  <input
                    className="form-control"
                    onChange={this.onChange}
                    value={this.state.telefono}
                    type="text"
                    name="telefono"
                  />
                </div>
                <div className="form-group">
                  <h5>Cantidad a abonar</h5>
                  <input
                    className="form-control"
                    onChange={this.onChange}
                    value={this.state.ahorrado}
                    type="number"
                    name="ahorrado"
                  />
                </div>
                <div className="form-group">
                  <button
                    className="btn btn-success btn-block form-control"
                    onChange={this.onChange}
                    type="submit"
                  >
                    Agregar Inversionista
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
