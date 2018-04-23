import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import React from "react";
import { Ticket } from "./Ticket";
import renderer from "react-test-renderer";
import { shallow, mount } from 'enzyme';

test('Ticket Component Contain One Table', () => {
    const wrapper = mount(
        <Ticket />
    );
    expect(wrapper.find('.table')).toHaveLength(1);

});

test("Test ticket component", () => {
  const component = renderer.create(
    <Ticket />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

});
