import axios from "axios";
import React, { Component } from "react";
import DatePiker from "react-datepicker";

export default class EditarCargo extends Component {
  state = {
    clientes: [],
    clienteNuevo: "hidden",
    clienteSelected: "",
    nomCliente: "",
    nomCargo: "",
    tienda: "",
    costo: "",
    venta: "",
    parcialidades: 1,
    date: new Date(),
  };

  async componentDidMount() {
    const resClientes = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/clientes`
    );
    const resCargo = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/cargos/${this.props.match.params.id}`
    );
    const resCliente = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/clientes/${resCargo.data.idCliente}`
    );
    /* console.log(resClientes.data);
    console.log(resCargo.data);
    console.log(resCliente.data); */
    this.setState({
      clientes: resClientes.data.map((cliente) => cliente.nombre),
      clienteSelected: resCliente.data.nombre,
      nomCliente: resCliente.data.nombre,
      nomCargo: resCargo.data.nomCargo,
      tienda: resCargo.data.tienda,
      costo: resCargo.data.costo,
      venta: resCargo.data.venta,
      parcialidades: resCargo.data.parcialidades,
      date: new Date(resCargo.data.anioAplicacion, resCargo.data.mesAplicacion),
    });
  }

  onChangeDate = (date) => {
    this.setState({
      date,
    });
  };

  onClientChange = (e) => {
    this.setState({
      clienteSelected: e.target.value,
    });
    if (e.target.value.length === 0) {
      this.setState({
        clienteNuevo: "text",
        nomCliente: "",
      });
    } else {
      this.setState({
        clienteNuevo: "hidden",
        nomCliente: e.target.value,
      });
    }
  };

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const newCargo = {
      nomCliente: this.state.nomCliente,
      nomCargo: this.state.nomCargo,
      tienda: this.state.tienda,
      costo: this.state.costo,
      venta: this.state.venta,
      parcialidades: this.state.parcialidades,
      fechaAplicacion: this.state.date,
    };
    await axios.put(
      process.env.REACT_APP_URI_PREFIX_WEB +
        "/api/cargos/" +
        this.props.match.params.id,
      newCargo
    );

    this.props.history.push("/clientes");
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-header">
              <h1>Modifica tu cargo</h1>
            </div>
            <div className="card-body">
              <form onSubmit={this.onSubmit} action="">
                <div className="form-group">
                  <h5>Cliente:</h5>
                  <select
                    className="form-control"
                    name="clienteSelected"
                    id=""
                    value={this.state.clienteSelected}
                    onChange={this.onClientChange}
                  >
                    {this.state.clientes.map((cliente) => (
                      <option key={cliente} value={cliente}>
                        {cliente}
                      </option>
                    ))}
                    <option value="">Nuevo</option>
                  </select>
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type={this.state.clienteNuevo}
                    placeholder="Nombre del nuevo cliente"
                    name="nomCliente"
                    value={this.state.nomCliente}
                    onChange={this.onInputChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Nombre del Cargo"
                    name="nomCargo"
                    value={this.state.nomCargo}
                    onChange={this.onInputChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    name="tienda"
                    placeholder="Tienda del Cargo"
                    value={this.state.tienda}
                    onChange={this.onInputChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Monto costo"
                    name="costo"
                    value={this.state.costo}
                    onChange={this.onInputChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Monto venta"
                    name="venta"
                    value={this.state.venta}
                    onChange={this.onInputChange}
                  />
                </div>
                <div className="form-group">
                  <h5>Mensualidades:</h5>
                  <select
                    className="form-control"
                    name="parcialidades"
                    value={this.state.parcialidades}
                    onChange={this.onInputChange}
                    id=""
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
                <div className="form-group">
                  <h5>Fecha de Aplicacion:</h5>
                  <DatePiker
                    className="form-control"
                    selected={this.state.date}
                    onChange={this.onChangeDate}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                  ></DatePiker>
                </div>
                <div className="form-group">
                  <button className="btn btn-success btn-block" type="submit">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
