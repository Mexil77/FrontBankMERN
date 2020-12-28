import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Mensualidades from "./Mensualidades";

export default class ClientesList extends Component {
  render() {
    return (
      <div className="card">
        <div className="card-header justify-content-between">
          <div className="row">
            <div className="col-md-3">
              <h1>{this.props.estado.clienteSelected.nombre}</h1>
            </div>
            <div className="col-md-9">
              <ul
                className="list-group list-group-horizontal-md"
                style={{ width: "100%" }}
              >
                <li className="list-group-item list-group-item-danger d-flex justify-content-between">
                  <h6>Deuda: </h6>
                  <h6>${this.props.estado.deudaTotal}</h6>
                </li>
                <li className="list-group-item list-group-item-success d-flex justify-content-between">
                  <h6>Abonado: </h6>
                  <h6>${this.props.estado.abonadoTotal}</h6>
                </li>
                <li className="list-group-item list-group-item-primary d-flex justify-content-between">
                  <h6>Faltante: </h6>
                  <h6>${this.props.estado.faltanteTotal}</h6>
                </li>
                <li className="list-group-item list-group-item-warning d-flex justify-content-between">
                  <h6>Cargos: </h6>
                  <h6>{this.props.estado.cargosCliente.length}</h6>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md">
              <ul className="list-group list-group-flush">
                {this.props.estado.cargosCliente.map((cargo) => (
                  <li key={cargo._id} className="list-group-item">
                    <ul className="list-group list-group-horizontal-md border border-dark">
                      <li className="list-group-item col-md-4">
                        <h6>{cargo.nomCargo}</h6>
                        <h6>{cargo.tienda}</h6>
                        <h6>${cargo.venta}</h6>
                        <h6>#{cargo.parcialidades}</h6>
                        <Link
                          className="btn btn-primary"
                          to={`/editarCargo/${cargo._id}`}
                        >
                          <FontAwesomeIcon
                            icon={["far", "edit"]}
                          ></FontAwesomeIcon>
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            this.props.onClickDeleted(
                              cargo._id,
                              cargo.idCliente
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={["far", "trash-alt"]}
                          ></FontAwesomeIcon>
                        </button>
                      </li>
                      <li className="list-group-item col-md-8">
                        <Mensualidades
                          key={cargo._id}
                          idCargo={cargo._id}
                          sumaDatos={this.props.sumaDatos}
                        ></Mensualidades>
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
