import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import Home from "./Home";
import Dashboard from "./Dashboard";
import { hot } from "react-hot-loader";
import { setAuth } from "../utils/api";
import NavBar from "./NavBar";
import { api } from "../utils/api";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({ name: "", email: "" });
    const { name, email } = user;

    useEffect(() => {
        if (loggedIn) {
            api.get("/users/me").then(response => {
                setUser(response.data);
            });
        }
    }, [loggedIn]);

    function login(sessionID) {
        setAuth(sessionID);
        setLoggedIn(true);
    }

    function logout() {
        setAuth("");
        setLoggedIn(false);
    }

    return !loggedIn ? (
        <Router>
            <Home path="/" login={login} />
        </Router>
    ) : (
        <div>
            <NavBar name={name} email={email} logout={logout} />
            <Router>
                <Dashboard path="/" name={name} />
            </Router>
        </div>
    );
}

export default hot(module)(App);
