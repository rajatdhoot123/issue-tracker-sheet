import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { v4 } from "uuid";

export class Ticket extends Component {
  state = {
    tickets: null
  };

  componentDidMount() {
    axios
      .get("http://localhost:5050/ticket/")
      .then(response => {
        this.setState({
          tickets: response.data.result
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleBlur = e => {
    let temp = this.state.tickets.find(ticket => ticket.id == e.target.name);
    temp.created_at = moment(temp.created_at).format("YYYY-MM-DD HH:mm:ss");
    temp.updated_at = moment().format("YYYY-MM-DD HH:mm:ss");

    axios
      .patch("http://localhost:5050/ticket/", temp)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleIssue = e => {
    let temp = this.state.tickets.find(ticket => ticket.id == e.target.name);
    temp.issue = e.target.value;
    temp.updated_at = temp.updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
    this.setState(prevState => ({
      tickets: [...prevState.tickets, ...temp]
    }));
  };

  render() {
    const { tickets } = this.state;
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Created At</th>
              <th scope="col">Update At</th>
              <th scope="col">Issue</th>
              <th scope="col">Issue By</th>
              <th scope="col">Status</th>
              <th scope="col">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {!!tickets &&
              tickets.map(
                (
                  {
                    id,
                    created_at,
                    updated_at,
                    issue,
                    issue_by,
                    status,
                    category
                  },
                  index
                ) => (
                  <tr key={id}>
                    <th scope="row">{id}</th>
                    <td>{moment(created_at).format("LLLL")}</td>
                    <td>{moment(updated_at).format("LLLL")}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        onChange={this.handleIssue}
                        value={issue}
                        name={id}
                        onBlur={this.handleBlur}
                      />
                    </td>
                    <td>{issue_by}</td>
                    <td>{status}</td>
                    <td>{category}</td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    );
  }
}
