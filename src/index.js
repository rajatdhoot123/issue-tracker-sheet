import React from "react";
import ReactDOM from "react-dom";
import { Ticket } from "./Ticket";

const Index = () => {
  return (
    <div>
      <Ticket />
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
