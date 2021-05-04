import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default class TarjetaParcialidad extends Component {
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
      <>
        {this.props.estado.parcialidades.map((parcialidad) => (
          <div key={parcialidad._id}>
            <ul className="list-group list-group-horizontal-md">
              <li
                className={`list-group-item col-md ${
                  this.state.pestana === "ventas"
                    ? parcialidad.pagadoVenta
                      ? "list-group-item-success"
                      : "list-group-item-danger"
                    : parcialidad.pagadoCosto
                    ? "list-group-item-success"
                    : "list-group-item-danger"
                }`}
              >
                <h5>{parcialidad.nomCliente}</h5>
                <h5>{parcialidad.nomCargo}</h5>
              </li>
              <li className="list-group-item col-md">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between p-0">
                    <h6>Deuda</h6>
                    {this.state.pestana === "ventas" ? (
                      <h6>${parcialidad.pVenta}</h6>
                    ) : (
                      <h6>${parcialidad.pCosto}</h6>
                    )}
                  </li>
                  <li className="list-group-item d-flex justify-content-between p-0">
                    <h6>Mens.</h6>
                    <h6>
                      {parcialidad.parcialidad} de {parcialidad.parcialidades}
                    </h6>
                  </li>
                  <li className="list-group-item d-flex justify-content-between p-0">
                    <h6>Abonado</h6>
                    {this.state.pestana === "ventas" ? (
                      <h6>${parcialidad.abonado}</h6>
                    ) : parcialidad.pagadoCosto === true ? (
                      <h6>${parcialidad.pCosto}</h6>
                    ) : (
                      <h6>${parcialidad.abonado}</h6>
                    )}
                  </li>
                  <li className="list-group-item d-flex justify-content-between p-0">
                    <h6>Banco</h6>
                    <h6>{parcialidad.nomTarjeta}</h6>
                  </li>
                </ul>
              </li>
              <li className="list-group-item col-md text-center">
                {/* 
                          FIXME:
                          Quitar el boton de pagado y mejorar el algoritmo de la etiqueta 
                        */}
                {this.state.pestana === "ventas" ? (
                  <div className="">
                    <Link
                      className={
                        parcialidad.pagadoVenta
                          ? "btn btn-success btn-block"
                          : "btn btn-primary btn-block"
                      }
                      to={
                        parcialidad.pagadoVenta
                          ? "#"
                          : `/abona/${parcialidad._id}`
                      }
                    >
                      {parcialidad.pagadoVenta ? "Pagado" : "Abonar"}
                    </Link>
                    {parcialidad.pagadoVenta ? (
                      ""
                    ) : (
                      <button
                        className="btn btn-warning btn-block"
                        onClick={() =>
                          this.props.liquidaParcialidad(parcialidad._id)
                        }
                      >
                        Liquidar
                      </button>
                    )}
                  </div>
                ) : parcialidad.pagadoCosto ? (
                  <h1>
                    <FontAwesomeIcon
                      icon={["far", "check-circle"]}
                      color="green"
                    />
                  </h1>
                ) : (
                  <h1>
                    <FontAwesomeIcon icon="ban" color="red" />
                  </h1>
                )}
              </li>
            </ul>
            <br />
          </div>
        ))}
      </>
    );
  }
}
