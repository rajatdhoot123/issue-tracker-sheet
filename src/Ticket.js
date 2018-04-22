import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { v4 } from "uuid";
import Select from "react-select";
import findIndex from "lodash.findindex";
import "react-select/dist/react-select.css";
import "./toast.css";

export class Ticket extends Component {
  state = {
    tickets: null,
    newTicket: false,
    status: ["pending", "resolved", "reopen"],
    active: "pending",
    selectedOption: "",
    searchBy: { value: "id", label: "Id" },
    searchState: [],
    search: false,
    toast: ""
  };

  componentDidMount() {
    axios
      .get("http://localhost:5050/ticket/")
      .then(response => {
        this.setState({
          tickets: response.data.result,
          searchState: response.data.result
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
            this.setState(
              {
                toast: "Saved"
              },
              () => setTimeout(() => this.setState({ toast: "" }), 1000)
            );
          })
          .catch(error => {
            debugger;
            this.setState(
              {
                toast: "Not Saved Try Again"
              },
              () => setTimeout(() => this.setState({ toast: "" }), 1000)
            );
          })
      : !!temp.issue_by &&
        !!temp.issue &&
        axios
          .post("http://localhost:5050/ticket/newticket/", temp)
          .then(response => {
            this.setState(
              {
                toast: "Saved",
                newTicket: false
              },
              () => setTimeout(() => this.setState({ toast: "" }), 1000)
            );
          })
          .catch(error => {
            debugger;
            this.setState(
              {
                toast: "Not Saved Try Again"
              },
              () => setTimeout(() => this.setState({ toast: "" }), 1000)
            );
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
    let newTicketId = !temp ? 0 : temp.id;
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

  handleChange = (id, status, selectedOption) => {
    let newStatus = { id: id, [status]: selectedOption.value };
    let selectedIndexTickets = findIndex(this.state.tickets, { id: id });
    let selectedIndexSearch = findIndex(this.state.searchState, { id: id });
    debugger;
    axios
      .patch("http://localhost:5050/ticket", newStatus)
      .then(response => {
        this.setState(
          prevState => ({
            tickets: [
              ...prevState.tickets.slice(0, selectedIndexTickets),
              {
                ...prevState.tickets[selectedIndexTickets],
                [status]: selectedOption.value
              },
              ...prevState.tickets.slice(++selectedIndexTickets)
            ],
            searchState: [
              ...prevState.searchState.slice(0, selectedIndexSearch),
              {
                ...prevState.searchState[selectedIndexSearch],
                [status]: selectedOption.value
              },
              ...prevState.searchState.slice(++selectedIndexSearch)
            ],
            toast: "Saved"
          }),
          () => setTimeout(() => this.setState({ toast: "" }), 1000)
        );
      })
      .catch(error => {
        debugger;
        this.setState(
          {
            toast: "Not Saved Try Again"
          },
          () => setTimeout(() => this.setState({ toast: "" }), 1000)
        );
      });
  };

  handleDelete = id => {
    let selectedIndexTickets = findIndex(this.state.tickets, { id: id });
    let selectedIndexSearch = findIndex(this.state.searchState, { id: id });
    axios
      .delete(`http://localhost:5050/ticket/delete/${id}`)
      .then(response => {
        this.setState(
          prevState => ({
            tickets: [
              ...prevState.tickets.slice(0, selectedIndexTickets),
              ...prevState.tickets.slice(++selectedIndexTickets)
            ],
            searchState: [
              ...prevState.searchState.slice(0, selectedIndexSearch),
              ...prevState.searchState.slice(++selectedIndexSearch)
            ],
            toast: "Deleted"
          }),
          () => setTimeout(() => this.setState({ toast: "" }), 1000)
        );
      })
      .catch(error => {
        debugger;
        this.setState(
          {
            toast: "Not Saved Try Again"
          },
          () => setTimeout(() => this.setState({ toast: "" }), 1000)
        );
      });
  };

  handleSearch = selectedOption => {
    this.setState({ searchBy: selectedOption });
  };

  handleSearchText = e => {
    let x = "" + e.target.value;
    let regex = new RegExp(x, "gi");
    this.setState(prevState => ({
      search: true,
      searchState: prevState.tickets.filter(ticket =>
        ("" + ticket[prevState.searchBy.value]).match(regex)
      )
    }));
  };

  textInput = e => {
    console.log(e, "eeeeeee");
  };

  render() {
    const {
      tickets,
      newTicket,
      status,
      selectedOption,
      searchState,
      search
    } = this.state;
    let allCategories = [
      { value: "Pending", label: "Pending" },
      { value: "Resolved", label: "Resolved" },
      { value: "Reopen", label: "Reopen" }
    ];
    let allIssue = [
      { value: "General", label: "General" },
      { value: "Food", label: "Food" },
      { value: "Cloths", label: "Cloths" }
    ];
    let searchOption = [
      { value: "id", label: "Id" },
      { value: "status", label: "Status" },
      { value: "category", label: "Category" },
      { value: "issue", label: "Issue" },
      { value: "issue_by", label: "Customer Name" },
    ];
    return (
      <div>
        <div id="snackbar" className={!!this.state.toast ? "show" : ""}>
          {this.state.toast}
        </div>
        <div className="card my-2 mx-4">
          <div className="d-flex card-body">
            <div className="w-25">
              <Select
                className="mx-2"
                name="status"
                value={this.state.searchBy}
                onChange={this.handleSearch}
                options={searchOption}
                clearable={false}
                searchable={true}
              />
            </div>
            <div>
              <input
                className="form-control mx-2"
                type="search"
                name="searchState"
                placeholder="Search"
                aria-label="Search"
                onChange={this.handleSearchText}
              />
            </div>
          </div>
        </div>

        <div className="card my-2 mx-4">
          <button
            className={
              newTicket
                ? "btn btn-outline-secondary mx-5 my-2"
                : "btn btn-outline-primary mx-5 my-2"
            }
            onClick={this.addNewTicket}
            disabled={newTicket}
          >
            Add New Ticket
          </button>
          {newTicket && (
            <div className="card-body mx-5 d-flex">
              <Select
                className="w-25"
                name="status"
                value={
                  !tickets[tickets.length - 1].category
                    ? ""
                    : tickets[tickets.length - 1].category
                }
                onChange={this.handleChange.bind(
                  this,
                  !tickets[tickets.length - 1].id
                    ? ""
                    : tickets[tickets.length - 1].id,
                  "category"
                )}
                options={allIssue}
                clearable={false}
                searchable={true}
              />
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
        <div className="table-responsive card">
          <div className="table-responsive card-body">
            {!!tickets && !tickets.length ? (
              <div className="text-center">
                No Support Ticket. Want to Create New ?
              </div>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Update At</th>
                    <th scope="col">Issue</th>
                    <th scope="col">Customer Name</th>
                    <th scope="col" style={{ width: "12%" }}>
                      Category
                    </th>
                    <th scope="col" style={{ width: "12%" }}>
                      Status
                    </th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!!tickets &&
                    (search ? searchState : tickets).map(
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
                          <td>{moment(created_at).format("LLL")}</td>
                          <td>{moment(updated_at).format("LLL")}</td>
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
                          <td>
                            <Select
                              name="status"
                              value={{ value: [id], label: category }}
                              onChange={this.handleChange.bind(
                                this,
                                id,
                                "category"
                              )}
                              options={allIssue}
                              clearable={false}
                              searchable={true}
                            />
                          </td>
                          <td>
                            <Select
                              name="category"
                              value={{ value: [id], label: status }}
                              onChange={this.handleChange.bind(
                                this,
                                id,
                                "status"
                              )}
                              options={allCategories}
                              clearable={false}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-dark"
                              onClick={this.handleDelete.bind(this, id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }
}
