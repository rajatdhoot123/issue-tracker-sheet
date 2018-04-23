import React from "react";
import { Ticket } from "./Ticket";
import renderer from "react-test-renderer";

test("Test ticket component", () => {
  const component = renderer.create(
    <Ticket />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  //  tree.props.onMouseEnter();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
