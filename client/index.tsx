import * as React from "react";
import * as ReactDOM from "react-dom";

import {App} from "./App";

require("file-loader?name=index.html!../index.html");

import "./assets/yeti.bootstrap.min.css"
import "./assets/main.css"

const rootEl = document.getElementById("root");

ReactDOM.render(
    <App/>, rootEl
);
