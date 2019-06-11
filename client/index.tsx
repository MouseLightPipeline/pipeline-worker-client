import * as React from "react";
import * as ReactDOM from "react-dom";

import {ApolloApp} from "./ApolloApp";

require("file-loader?name=index.html!../index.html");

import "./assets/yeti.bootstrap.min.css"
import "./assets/main.css"

const rootEl = document.getElementById("root");

ReactDOM.render(
    <ApolloApp/>, rootEl
);
