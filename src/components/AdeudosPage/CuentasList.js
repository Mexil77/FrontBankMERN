import React, { Component } from "react";

export default class CuentasList extends Component {
  state = {
    pestana: "",
  };

  componentDidMount() {
    if (
      this.props.pestana === "ventas" ||
      this.props.pestana === "inversiones"
    ) {
      this.setState({ pestana: "ventas" });
    }
  }

  render() {
    return (
      <div className="datos">
        <ul className="list-group list-group-flush">
          <li className="list-group-item list-group-item-danger d-flex justify-content-between ">
            <h6>{this.props.estado.textoDeudaMes}</h6>
            {this.state.pestana === "ventas" ? (
              <h6>${this.props.estado.deudaMesVenta}</h6>
            ) : (
              <h6>${this.props.estado.deudaMesBanco}</h6>
            )}
          </li>
          <li className="list-group-item list-group-item-success d-flex justify-content-between">
            <h6>{this.props.estado.textoAbonoMes}</h6>
            {this.state.pestana === "ventas" ? (
              <h6>${this.props.estado.abonoMesVenta}</h6>
            ) : (
              <h6>${this.props.estado.abonoMesBanco}</h6>
            )}
          </li>
          <li className="list-group-item list-group-item-warning d-flex justify-content-between ">
            <h6>Faltante</h6>
            {this.state.pestana === "ventas" ? (
              <h6>${this.props.estado.faltanteVenta}</h6>
            ) : (
              <h6>${this.props.estado.faltanteBanco}</h6>
            )}
          </li>
          <li className="list-group-item list-group-item-primary d-flex justify-content-between">
            <h6>Total a tener</h6>
            <h6>${this.props.estado.abonadoTotal}</h6>
          </li>
        </ul>
      </div>
    );
  }
}
