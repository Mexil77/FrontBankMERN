import React, { Component } from "react";
import TarjetaParcialidad from "./TarjetaParcialidad";

export default class CargosList extends Component {
  state = {
    monthName: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
  };

  render() {
    return (
      <div className="card">
        <div className="card-header">
          <h1>
            {this.state.monthName[this.props.estado.date.getMonth()]},{" "}
            {this.props.estado.date.getFullYear()}
          </h1>
        </div>
        <div className="card-body">
          <TarjetaParcialidad
            pestana={this.props.pestana}
            estado={this.props.estado}
            liquidaParcialidad={this.props.liquidaParcialidad}
          />
        </div>
      </div>
    );
  }
}
