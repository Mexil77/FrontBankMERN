import React, { Component } from "react";

export default class ClientesFiltro extends Component {
  render() {
    return (
      <div className="card">
        <div className="card-header">
          <h1>Clientes</h1>
        </div>
        <div className="card-body">
          <ul className="list-group">
            {this.props.estado.clientes.map((cliente) => (
              <li
                key={cliente._id}
                className="list-group-item list-group-item-action"
                onClick={() => this.props.onClickCliente(cliente._id)}
              >
                {cliente.nombre}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
