import React from "react";
import { Router } from "@reach/router";
import Login from "./Login";
import { hot } from "react-hot-loader";

function App() {
    return (
        <Router>
            <Login path="login" />
        </Router>
    );
}

export default hot(module)(App);
