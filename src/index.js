import React from "react";
import ReactDOM from "react-dom";
import { Ticket } from "./Ticket";
import 'bootstrap/dist/css/bootstrap.css';

const Index = () => {
  return (
    <div>
      <Ticket />
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
