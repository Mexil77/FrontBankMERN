import React, { Component } from "react";
import axios from "axios";

export default class Mensualidades extends Component {
  state = {
    mensualidades: [],
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
    date: new Date(),
    abonadoTotal: 0,
    restanteTotal: 0,
  };

  componentDidMount() {
    this.getMensualidades();
  }

  getMensualidades = async () => {
    const res = await axios.get(
      process.env.REACT_APP_URI_PREFIX_WEB +
        "/api/parcialidades/idCargo/" +
        this.props.idCargo
    );
    const resCargo = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/cargos/${this.props.idCargo}`
    );
    /* const fechaActual = new Date(
      this.state.date.getFullYear(),
      this.state.date.getMonth()
    ); */
    var sumaAbono = 0;
    /* sumaDeuda = 0; */
    // eslint-disable-next-line
    res.data.map((parcialidad) => {
      /* const fechaParcialidad = new Date(
        parcialidad.anioParcialidad,
        parcialidad.mesParcialidad
      ); */
      sumaAbono += parcialidad.abonado;
      /* if (fechaParcialidad >= fechaActual) {
        sumaDeuda += parcialidad.pVenta;
      } */
    });
    this.props.sumaDatos(sumaAbono, resCargo.data.venta);
    const restante = resCargo.data.venta - sumaAbono;
    this.setState({
      mensualidades: res.data,
      abonadoTotal: sumaAbono,
      restanteTotal: restante,
    });
  };

  render() {
    return (
      <div className="cantidades">
        <ul
          className="list-group list-group-flush"
          style={{
            height: "165px",
            overflow: "hidden",
            overflowY: "scroll",
          }}
        >
          {this.state.mensualidades.map((mensualidad) => (
            <li
              key={mensualidad._id}
              className={`list-group-item d-flex justify-content-between p-0 ${
                mensualidad.pagadoVenta
                  ? "list-group-item-success"
                  : "list-group-item-danger"
              }`}
            >
              <h6>
                {mensualidad.parcialidad} de {mensualidad.parcialidades}
              </h6>
              <h6>{`${this.state.monthName[mensualidad.mesParcialidad]}/${
                mensualidad.anioParcialidad
              }`}</h6>
              <h6>
                ${mensualidad.abonado}/${mensualidad.pVenta}
              </h6>
            </li>
          ))}
        </ul>
        <div className="cant d-flex justify-content-between">
          <h6>Deuda restante: ${this.state.restanteTotal}</h6>
          <h6>Abonado: ${this.state.abonadoTotal}</h6>
        </div>
      </div>
    );
  }
}
