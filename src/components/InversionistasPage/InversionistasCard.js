import React, { Component } from "react";
import axios from "axios";

export default class InversionistasCard extends Component {
  state = {
    newAhorro: "",
    id: "",
    form: false,
  };

  imprimeState = () => {
    console.log(this.state);
  };

  despliegaForm = (newId) => {
    const newForm = !this.state.form;
    this.setState(
      {
        form: newForm,
        id: newId,
      },
      this.imprimeState
    );
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    await axios.put(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/inversionistas/${this.state.id}/${this.state.newAhorro}`
    );

    window.location.href = "/inversionistas";
  };

  render() {
    return (
      <li className="list-group-item">
        <ul className="list-group list-group-horizontal-md border border-dark">
          <li className="list-group-item col-md-4">
            <h1>{this.props.inversionista.nombre}</h1>
          </li>
          <li className="list-group-item col-md-4">
            <h6>{this.props.inversionista.telefono}</h6>
            <h6>${this.props.inversionista.ahorrado}</h6>
            <h6>{this.props.inversionista.porcentajeGanancia}%</h6>
            {this.state.form ? (
              <>
                <div className="form-group">
                  <button
                    className="btn btn-danger"
                    onClick={this.despliegaForm}
                  >
                    Cancel
                  </button>
                </div>
                <form action="" onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="number"
                      name="newAhorro"
                      placeholder="Cantidad"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-success btn-block" type="submit">
                      Aceptar
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.despliegaForm(this.props.inversionista._id)}
              >
                Ahorrar
              </button>
            )}
          </li>
          <li className="list-group-item col-md-4">
            <button
              className="btn btn-success"
              onClick={() =>
                this.props.eliminaInversionista(this.props.inversionista._id)
              }
            >
              Cobrar
            </button>
          </li>
        </ul>
      </li>
    );
  }
}
