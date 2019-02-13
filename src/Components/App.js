import React from "react";
import { Router } from "@reach/router";
import Home from "./Home";
import { hot } from "react-hot-loader";

function App() {
    return (
        <Router>
            <Home path="/" />
        </Router>
    );
}

export default hot(module)(App);
