import * as React from 'react';

import {TaskDefinitionsWithQuery} from "./GraphQLComponents";
import MyComponentWithData from "./Counter";

export default function Layout() {
  return (
    <div>
      <h1>Hello, worlds!</h1>
        <MyComponentWithData/>
        <TaskDefinitionsWithQuery/>
    </div>
  )
}
