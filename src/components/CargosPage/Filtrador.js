import React, { Component } from "react";
import DatePiker from "react-datepicker";

export default class Filtrador extends Component {
  render() {
    return (
      <div className="card">
        <div className="card-header">
          <h2>Filtrar</h2>
        </div>
        <div className="card-body">
          <div className="form-group">
            <DatePiker
              className="form-control"
              selected={this.props.estado.date}
              onChange={this.props.onDateChange}
              dateFormat="MM/yyyy"
              showMonthYearPicker
            ></DatePiker>
          </div>
          <div className="form-group">
            <select
              className="form-control"
              name="clienteSelected"
              id=""
              value={this.props.estado.clienteSelected}
              onChange={this.props.onFilterChange}
            >
              <option value="Todos">Todos</option>
              {this.props.estado.clientes.map((cliente) => (
                <option key={cliente._id} value={cliente.nombre}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
}
