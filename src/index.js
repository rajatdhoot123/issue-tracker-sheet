import React from "react";
import ReactDOM from "react-dom";
import { Ticket } from "./Ticket";

const Index = () => {
  return (
    <div>
      <span>Support Ticket App</span>
      <Ticket />
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
