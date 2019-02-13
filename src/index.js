import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App";
import style from "./index.scss";

const root = document.createElement("div");
root.id = "root";
root.style.height = "100%";
document.body.appendChild(root);

ReactDOM.render(<App />, root);
