import React, { Component } from "react";
import axios from "axios";

export default class Abonar extends Component {
  state = {
    idCliente: "",
    restante: 0,
    abono: "",
  };

  componentDidMount() {
    this.getParcialidad();
  }

  getParcialidad = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/parcialidades/idParcialidad/${this.props.match.params.id}`
    );
    this.setState({
      idCliente: this.props.match.params.id,
      restante: res.data.pVenta - res.data.abonado,
    });
  };

  onInputChange = (e) => {
    this.setState({
      abono: e.target.value,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    console.log(this.state.abono);
    const abono = {
      abonado: this.state.abono,
    };
    await axios.put(
      `${process.env.REACT_APP_URI_PREFIX_WEB}/api/parcialidades/idParcialidad/${this.state.idCliente}`,
      abono
    );
    this.props.history.push("/listaCargosTarjetasVenta/ventas");
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-header">
              <h2>
                Te faltan ${this.state.restante} <br /> para liquidar esto.
              </h2>
            </div>
            <div className="card-body">
              <form action="" onSubmit={this.onSubmit}>
                <div className="form-group">
                  <h5>Cuanto deseas abonar?</h5>
                  <input
                    className="form-control"
                    type="number"
                    name=""
                    placeholder="$0"
                    id=""
                    value={this.state.abono}
                    onChange={this.onInputChange}
                  />
                </div>
                <div className="form-group">
                  <button className="btn btn-primary btn-block" type="submit">
                    Abonar
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
