import React, { Component } from "react";

import InversionistasCard from "./InversionistasCard";

export default class InversionistasList extends Component {
  render() {
    return (
      <ul className="list-group list-group-flush">
        {this.props.estado.inversionistas.map((inversionista) => (
          <InversionistasCard
            key={inversionista._id}
            inversionista={inversionista}
            eliminaInversionista={this.props.eliminaInversionista}
          />
        ))}
      </ul>
    );
  }
}
