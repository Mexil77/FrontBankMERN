import axios from "axios";
import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
/* import Cookies from "universal-cookie";
const cookie = new Cookies(); */

import CuentaList from "./CuentasList";
import Filtrador from "./Filtrador";
import CargosList from "./CargosList";

export default class CargosPage extends Component {
  state = {
    cargosVentas: true,
    parcialidades: [],
    date: new Date(),
    clientes: [],
    clienteSelected: "Todos",
    textoDeudaMes: "Pagar este mes",
    textoAbonoMes: "Juntado este mes",
    deudaMesVenta: 0,
    faltanteVenta: 0,
    abonoMesVenta: 0,
    deudaMesBanco: 0,
    faltanteBanco: 0,
    abonoMesBanco: 0,
    pagado: false,
    abonadoTotal: 0,
  };

  componentDidMount() {
    this.getAbonoTotal();
    this.getParcialidades();
    this.getClientes();
  }

  getAbonoTotal = async () => {
    /* FIXME:
    Dejar de llamar todos los cargos */
    const parcialidades = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/parcialidades/${this.props.match.params.id}`
    );
    const fechaActuaNueva = new Date();
    const fechaActual = new Date(
      fechaActuaNueva.getFullYear(),
      fechaActuaNueva.getMonth()
    );
    let sumaAbono = 0;

    parcialidades.data.forEach((parcialidad) => {
      const fechaParcialidad = new Date(
        parcialidad.anioParcialidad,
        parcialidad.mesParcialidad
      );
      if (fechaParcialidad >= fechaActual) {
        if (this.props.match.params.id === "banco") {
          if (parcialidad.pagadoCosto) {
            sumaAbono += parcialidad.pCosto;
          } else {
            sumaAbono += parcialidad.abonado;
          }
        } else {
          sumaAbono += parcialidad.abonado;
        }
      }
    });
    this.setState(
      {
        abonadoTotal: sumaAbono,
      },
      this.getParcialidades
    );
  };

  getClientes = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/clientes`
    );
    this.setState({
      clientes: res.data,
    });
  };

  getParcialidades = async () => {
    // eslint-disable-next-line
    const ret = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/parcialidades/filtro/1/0-0/nada`
    );
    const res = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/parcialidades/filtro/${
        this.state.clienteSelected
      }/${this.state.date.getMonth()}-${this.state.date.getFullYear()}/${
        this.props.match.params.id
      }`
    );
    let sumaDeudaV = 0,
      sumaAbonoV = 0,
      sumaDeudaB = 0,
      sumaAbonoB = 0,
      TDM = "",
      TAM = "";

    res.data.forEach((mensualidad) => {
      sumaDeudaV += mensualidad.pVenta;
      sumaAbonoV += mensualidad.abonado;
      sumaDeudaB += mensualidad.pCosto;
      if (mensualidad.pagadoCosto) {
        sumaAbonoB += mensualidad.pCosto;
      } else {
        sumaAbonoB += mensualidad.abonado;
      }
    });

    if (this.state.clienteSelected !== "Todos") {
      TDM = `${this.state.clienteSelected} te debe`;
      TAM = `${this.state.clienteSelected} te ha abonado`;
    } else {
      TDM = "Pagar este mes";
      TAM = "Juntado este mes";
    }
    const faltanteV = sumaDeudaV - sumaAbonoV;
    const faltanteB = sumaDeudaB - sumaAbonoB;
    this.setState({
      parcialidades: res.data,
      deudaMesVenta: sumaDeudaV,
      faltanteVenta: faltanteV,
      abonoMesVenta: sumaAbonoV,
      deudaMesBanco: sumaDeudaB,
      faltanteBanco: faltanteB,
      abonoMesBanco: sumaAbonoB,
      textoDeudaMes: TDM,
      textoAbonoMes: TAM,
    });
  };

  onDateChange = (date) => {
    this.setState({ date: date });
    this.getParcialidades();
  };

  onFilterChange = async (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    this.getParcialidades();
  };

  liquidaParcialidad = async (idParcialidad) => {
    const resPar = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/parcialidades/idParcialidad/${idParcialidad}`
    );
    const restante = resPar.data.pVenta - resPar.data.abonado;
    const abono = {
      abonado: restante,
    };
    await axios.put(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/parcialidades/idParcialidad/${idParcialidad}`,
      abono
    );
    this.getAbonoTotal();
    /* this.getParcialidades(); */
    this.getClientes();
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-4">
          <CuentaList
            pestana={this.props.match.params.id}
            estado={this.state}
          />
          <br />
          <Filtrador
            estado={this.state}
            onDateChange={this.onDateChange}
            onFilterChange={this.onFilterChange}
          />
          <br />
          <Link className="btn btn-danger btn-block" to="/creaCargo">
            Agregar Cargo
          </Link>
          <br />
        </div>
        <div className="col-md-8">
          <CargosList
            pestana={this.props.match.params.id}
            estado={this.state}
            liquidaParcialidad={this.liquidaParcialidad}
          />
        </div>
      </div>
    );
  }
}
