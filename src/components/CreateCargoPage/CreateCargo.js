import axios from "axios";
import React, { Component } from "react";
import DatePiker from "react-datepicker";

export default class CreateCargo extends Component {
  state = {
    clientes: [],
    clienteSelected: "",
    nomCliente: "",
    nomCargo: "",
    tienda: "",
    costo: "",
    newCosto: 0,
    venta: "",
    newVenta: 0,
    parcialidades: 1,
    mensualidadCosto: 0,
    mensualidadVenta: 0,
    date: new Date(),
    tarjetas: [],
    tarjetaSelected: "",
    nomTarjeta: "",
    inversionDisponible: 0,
  };

  async componentDidMount() {
    this.dameClientes();
    this.dameTarjetas();
    this.calculaDisponible();
  }

  calculaDisponible = async () => {
    const inversionistas = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/inversionistas`
    );
    let total = 0;
    inversionistas.data.forEach((inversionista) => {
      total += inversionista.ahorrado;
    });
    const cargos = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/cargos/cargosFinansiamiento/Inversion`
    );
    let totalDisponible = total;
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
      inversionDisponible: Number(totalDisponible.toFixed(2)),
    });
  };

  dameTarjetas = async () => {
    const tarjetas = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/tarjetas`
    );
    if (tarjetas.data.length > 0) {
      this.setState({
        tarjetas: tarjetas.data.map((cliente) => cliente.nombre),
        tarjetaSelected: tarjetas.data[0].nombre,
        nomTarjeta: tarjetas.data[0].nombre,
      });
    } else {
      this.setState({
        nomTarjeta: "",
      });
    }
  };

  dameClientes = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/clientes`
    );
    if (res.data.length > 0) {
      this.setState({
        clientes: res.data.map((cliente) => cliente.nombre),
        clienteSelected: res.data[0].nombre,
        nomCliente: res.data[0].nombre,
      });
    } else {
      this.setState({
        nomCliente: "",
      });
    }
  };

  onChangeDate = (date) => {
    this.setState({
      date,
    });
  };

  imprimeState = () => {
    console.log(this.state);
  };

  onClientChange = (e) => {
    this.setState({
      clienteSelected: e.target.value,
    });
    if (e.target.value.length === 0) {
      this.setState({
        nomCliente: "",
      });
    } else {
      this.setState({
        nomCliente: e.target.value,
      });
    }
  };

  onTarjetaChange = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      this.alertaInversionInsuficiente
    );
    if (e.target.value.length === 0) {
      this.setState({
        nomTarjeta: "",
      });
    } else {
      this.setState({
        nomTarjeta: e.target.value,
      });
    }
  };

  onInputChange = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      this.cotiza
    );
  };

  onSubmit = async (e) => {
    e.preventDefault();
    if (!this.alertaInversionInsuficiente()) {
      let costo = this.state.newCosto;
      let venta = this.state.newVenta;
      const newCargo = {
        nomCliente: this.state.nomCliente,
        nomCargo: this.state.nomCargo,
        tienda: this.state.tienda,
        costo: costo,
        venta: venta,
        parcialidades: this.state.parcialidades,
        fechaAplicacion: this.state.date,
        nomTarjeta: this.state.nomTarjeta,
      };
      await axios.post(
        process.env.REACT_APP_URI_PREFIX_WEB + "/api/cargos",
        newCargo
      );
      this.props.history.push("/listaCargosTarjetasVenta/ventas");
    }
  };

  cotiza = () => {
    let newCosto = Number(this.state.costo);
    let newVenta = Number(this.state.venta);
    let mensualidadCosto = Number(this.state.costo) / this.state.parcialidades;
    let mensualidadVenta = Number(this.state.venta) / this.state.parcialidades;
    if (Number(this.state.costo) % this.state.parcialidades !== 0) {
      newCosto =
        Number(
          (Number(this.state.costo) / this.state.parcialidades).toFixed()
        ) * this.state.parcialidades;
      mensualidadCosto = newCosto / this.state.parcialidades;
    }
    if (Number(this.state.venta) % this.state.parcialidades !== 0) {
      newVenta =
        Number(
          (Number(this.state.venta) / this.state.parcialidades).toFixed()
        ) * this.state.parcialidades;
      mensualidadVenta = newVenta / this.state.parcialidades;
    }

    this.setState(
      {
        newCosto,
        newVenta,
        mensualidadCosto,
        mensualidadVenta,
      },
      this.alertaInversionInsuficiente
    );
  };

  alertaInversionInsuficiente = () => {
    if (this.state.tarjetaSelected === "Inversion") {
      if (Number(this.state.costo) > this.state.inversionDisponible) {
        alert(
          `Tienes $${this.state.inversionDisponible} de credito disponible y no cubre el costo de tu articulo
          - Puedes intentar con alguna otra tarjeta
          - Intenta bajar el costo de tu producto
          `
        );
        return true;
      }
    }
    return false;
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h1>Crea un nuevo cargo</h1>
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
                  {this.state.clienteSelected === "" ? (
                    <input
                      className="form-control"
                      placeholder="Nombre del nuevo cliente"
                      name="nomCliente"
                      value={this.state.nomCliente}
                      onChange={this.onInputChange}
                    />
                  ) : (
                    <></>
                  )}
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
                  <h5>Terjeta:</h5>
                  <select
                    className="form-control"
                    name="tarjetaSelected"
                    value={this.state.tarjetaSelected}
                    onChange={this.onTarjetaChange}
                  >
                    {this.state.tarjetas.map((cliente) => (
                      <option key={cliente} value={cliente}>
                        {cliente}
                      </option>
                    ))}
                    <option value="Inversion">Inversion</option>
                    <option value="">Nuevo</option>
                  </select>
                </div>
                <div className="form-group">
                  {this.state.tarjetaSelected === "" ? (
                    <input
                      className="form-control"
                      placeholder="Nombre de la nueva Tarjeta"
                      name="nomTarjeta"
                      value={this.state.nomTarjeta}
                      onChange={this.onInputChange}
                    />
                  ) : (
                    <></>
                  )}
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
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2>Cotizador</h2>
            </div>
            <div className="card-body">
              <h2>Tu cargo cerrado es: </h2>
              <h6>Costo: {this.state.newCosto}</h6>
              <h6>Venta: {this.state.newVenta}</h6>
              <h2>Tus Mensualidades son: </h2>
              <h6>Costo: {this.state.mensualidadCosto}</h6>
              <h6>Venta: {this.state.mensualidadVenta}</h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
