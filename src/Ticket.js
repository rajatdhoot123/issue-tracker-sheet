import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { v4 } from "uuid";
import Select from "react-select";
import "react-select/dist/react-select.css";

export class Ticket extends Component {
  state = {
    tickets: null,
    newTicket: false,
    status: ["pending", "resolved", "reopen"],
    active: "pending",
    selectedOption: ""
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
    let isNewTicket = e.target.name == "issue" || e.target.name == "issue_by";
    let temp = isNewTicket
      ? this.state.tickets[this.state.tickets.length - 1]
      : this.state.tickets.find(ticket => ticket.id == e.target.name);
    temp.created_at = moment(temp.created_at).format("YYYY-MM-DD HH:mm:ss");
    !isNewTicket
      ? axios
          .patch("http://localhost:5050/ticket/", temp)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          })
      : !!temp.issue_by &&
        !!temp.issue &&
        axios
          .post("http://localhost:5050/ticket/newticket/", temp)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
  };

  handleIssue = e => {
    let isNewTicket = e.target.name == "issue" || e.target.name == "issue_by";
    let temp = isNewTicket
      ? this.state.tickets[this.state.tickets.length - 1]
      : this.state.tickets.find(ticket => ticket.id == e.target.name);
    e.target.name == "issue_by"
      ? (temp.issue_by = e.target.value)
      : (temp.issue = e.target.value);
    temp.updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
    this.setState(prevState => ({
      tickets: [...prevState.tickets, ...temp]
    }));
  };

  addNewTicket = () => {
    let temp = this.state.tickets[this.state.tickets.length - 1];
    let newTicketId = temp.id;
    this.setState(prevState => ({
      newTicket: true,
      tickets: [
        ...prevState.tickets,
        ...[
          {
            id: ++newTicketId,
            created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            status: "Pending"
          }
        ]
      ]
    }));
  };

  handleChange = (id, selectedOption) => {
    let newStatus = {id: id,status: selectedOption.value}
    axios
      .patch("http://localhost:5050/ticket", newStatus)
      .then(response => {
        console.log(response,"response")
        this.setState(prevState => ({
          tickets: [
            ...prevState.tickets.slice(0, id - 1),
            { ...prevState.tickets[id - 1], status: selectedOption.value },
            ...prevState.tickets.slice(id)
          ]
        }));
      })
      .catch(error => {
        console.log(error);
      });
  };
  render() {
    const { tickets, newTicket, status, selectedOption } = this.state;
    let allCategories = [
      { value: "Pending", label: "Pending" },
      { value: "Resolved", label: "Resolved" },
      { value: "Reopen", label: "Reopen" }
    ];
    return (
      <div>
        <div className="card my-2 mx-4">
          <button
            className="btn btn-outline-primary mx-5 my-2"
            onClick={this.addNewTicket}
          >
            Add New Ticket
          </button>
          {newTicket && (
            <div className="card-body mx-5 d-flex">
              <input
                type="text"
                className="form-control mx-2"
                onChange={this.handleIssue}
                placeholder="Issue"
                name="issue"
                onBlur={this.handleBlur}
                value={
                  !tickets[tickets.length - 1].issue
                    ? ""
                    : tickets[tickets.length - 1].issue
                }
              />
              <input
                type="text"
                className="form-control mx-2"
                onChange={this.handleIssue}
                placeholder="Customer Name"
                onBlur={this.handleBlur}
                name="issue_by"
                value={
                  !tickets[tickets.length - 1].issue_by
                    ? ""
                    : tickets[tickets.length - 1].issue_by
                }
              />
            </div>
          )}
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Created At</th>
              <th scope="col">Update At</th>
              <th scope="col">Issue</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Category</th>
              <th scope="col" style={{ width: "15%" }}>
                Status
              </th>
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
                    <td>{category}</td>
                    <td>
                      <Select
                        name="form-field-name"
                        value={{ value: [id], label: tickets[id - 1].status }}
                        onChange={this.handleChange.bind(this, id)}
                        options={allCategories}
                        clearable={false}
                      />
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    );
  }
}
