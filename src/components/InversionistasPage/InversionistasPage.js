import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import InversionistasList from "./InversionistasList";

export default class InversionistasPage extends Component {
  state = {
    inversionistas: [],
    totalInvertido: 0,
    disponible: 0,
  };

  componentDidMount() {
    this.dameInversionistas();
    this.dameTotal();
  }

  dameInversionistas = async () => {
    const inversionistas = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/inversionistas`
    );
    this.setState(
      {
        inversionistas: inversionistas.data,
      },
      this.sumaTotal
    );
  };

  sumaTotal = () => {
    let total = 0;
    this.state.inversionistas.forEach((inversionista) => {
      total += inversionista.ahorrado;
    });
    this.setState({
      totalInvertido: total,
    });
  };

  dameTotal = async () => {
    const cargos = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/cargos/cargosFinansiamiento/Inversion`
    );
    let totalDisponible = this.state.totalInvertido;
    await Promise.all(
      cargos.data.map(async (cargo) => {
        if (!cargo.pagado) {
          totalDisponible -= cargo.costo;
          const parcialidades = await axios.get(
            `${process.env.REACT_APP_URI_PREFIX_WEB}/api/parcialidades/idCargo/${cargo._id}`
          );
          parcialidades.data.forEach((parcialidad) => {
            totalDisponible += parcialidad.abonado;
          });
        }
      })
    );
    this.setState({
      disponible: Number(totalDisponible.toFixed(2)),
    });
  };

  eliminaInversionista = async (id) => {
    const inver = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/inversionistas/${id}`
    );
    const cantidad = await axios.delete(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/inversionistas/${id}`
    );
    alert(`Se pagaron ${cantidad.data.Pagar} a ${inver.data.nombre}`);
    this.dameInversionistas();
    this.dameTotal();
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-3">
          <Link className="btn btn-danger btn-block" to="/creaInversionista">
            Agrega inversionistas
          </Link>
        </div>
        <div className="col-md-9">
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-6">
                  <h2>Inversionistas</h2>
                </div>
                <div className="col-md-6 ml-auto">
                  <ul
                    className="list-group list-group-horizontal-md"
                    style={{ width: "100%" }}
                  >
                    <li className="list-group-item list-group-item-danger d-flex justify-content-between">
                      <h6>Total: </h6>
                      <h6>${this.state.totalInvertido}</h6>
                    </li>
                    <li className="list-group-item list-group-item-warning d-flex justify-content-between">
                      <h6>disponible: </h6>
                      <h6>${this.state.disponible}</h6>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body">
              <InversionistasList
                estado={this.state}
                eliminaInversionista={this.eliminaInversionista}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
