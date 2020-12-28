import React, { Component } from "react";
import axios from "axios";

import Clientesfiltro from "./ClientesFiltro";
import ClientesList from "./ClientesList";

export default class ClientesPage extends Component {
  state = {
    clientes: [],
    cargosCliente: [],
    mensualidadesCliente: {},
    clienteSelected: {},
    prueba: "",
    deudaTotal: 0,
    abonadoTotal: 0,
    faltanteTotal: 0,
  };

  componentDidMount() {
    this.getClientes();
  }

  getPrueba = (P) => {
    console.log("prueba Correscta");
    this.setState({
      prueba: P,
    });
  };

  getClientes = async () => {
    const res = await axios.get(
      process.env.REACT_APP_URI_PREFIX_WEB + "/api/clientes"
    );
    this.setState({
      clientes: res.data,
    });
  };

  getCliente = async (id) => {
    const res = await axios.get(
      process.env.REACT_APP_URI_PREFIX_WEB + "/api/clientes/" + id
    );
    this.setState({
      clienteSelected: res.data,
    });
  };

  sumaDatos = (abonoTotalCargo, deudaTotalCargo) => {
    const faltanteTotalCargo = deudaTotalCargo - abonoTotalCargo;
    const newAbonoTotal = this.state.abonadoTotal + abonoTotalCargo;
    const newDeudaTotal = this.state.deudaTotal + deudaTotalCargo;
    const newFaltanteTotal = this.state.faltanteTotal + faltanteTotalCargo;
    this.setState({
      deudaTotal: newDeudaTotal,
      abonadoTotal: newAbonoTotal,
      faltanteTotal: newFaltanteTotal,
    });
  };

  onClickCliente = async (id) => {
    const resCargos = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/cargos/idCliente/${id}/${this.props.match.params.id}`
    );
    this.setState({
      cargosCliente: resCargos.data,
      deudaTotal: 0,
      abonadoTotal: 0,
      faltanteTotal: 0,
    });
    this.getCliente(id);
  };

  onClickDeleted = async (idCargo, idCliente) => {
    const resCargo = await axios.get(
      process.env.REACT_APP_URI_PREFIX_WEB + "/api/cargos/" + idCargo
    );
    const newDeuda = this.state.deudaTotal - resCargo.data.venta;
    const newAbono =
      this.state.abonadoTotal - (await this.dameAbonado(idCargo));
    const newRestante = newDeuda - newAbono;
    await axios.delete(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/cargos/${idCargo}`
    );
    const resCargos = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/cargos/idCliente/${idCliente}/${this.props.match.params.id}`
    );
    this.setState({
      cargosCliente: resCargos.data,
      deudaTotal: newDeuda,
      abonadoTotal: newAbono,
      faltanteTotal: newRestante,
    });
    this.getCliente(idCliente);
  };

  dameAbonado = async (idCargo) => {
    const parcialidades = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/parcialidades/idCargo/${idCargo}`
    );
    var totalAbono = 0;
    parcialidades.data.map(
      (parcialidad) => (totalAbono += parcialidad.abonado)
    );
    return totalAbono;
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-3">
          <Clientesfiltro
            estado={this.state}
            onClickCliente={this.onClickCliente}
          />
          <br />
        </div>
        <div className="col-md-9">
          <ClientesList
            estado={this.state}
            onClickDeleted={this.onClickDeleted}
            sumaDatos={this.sumaDatos}
          />
        </div>
      </div>
    );
  }
}
