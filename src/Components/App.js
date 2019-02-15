import React, { useState, useEffect } from "react";
import SecureLS from "secure-ls";
import { Router } from "@reach/router";
import { hot } from "react-hot-loader";
import { api, setAuth } from "../utils/api";

import Home from "./Home";
import Dashboard from "./Dashboard";
import NavBar from "./NavBar";

const storage = new SecureLS({ encodingType: "aes" });
const channel = new BroadcastChannel("session");

function App() {
    const [loggedIn, setLoggedIn] = useState(() => {
        const alreadyIn = storage.get("loggedIn");
        if (alreadyIn === true) {
            const sessionID = storage.get("sessionID");
            setAuth(sessionID);
            return true;
        }
        return false;
    });

    const [user, setUser] = useState({
        name: "",
        email: "",
        organisationId: null,
        loaded: false
    });

    useEffect(() => {
        if (loggedIn) {
            api.get("/users/me").then(response => {
                setUser(response.data);
            });
        }
    }, [loggedIn]);

    useEffect(() => {
        channel.onmessage = ({ data }) => {
            const { type, payload } = data;
            switch (type) {
                case "LOGIN":
                    login(payload, false);
                    break;
                case "LOGOUT":
                    logout(false);
                    break;
            }
        };
        return () => channel.close();
    }, []);

    function login(sessionID, selfInitiated) {
        setAuth(sessionID);
        setLoggedIn(true);
        if (selfInitiated === true || selfInitiated === undefined) {
            storage.set("sessionID", sessionID);
            storage.set("loggedIn", true);
            channel.postMessage({ type: "LOGIN", payload: sessionID });
        }
    }

    function logout(selfInitiated) {
        setAuth("");
        setLoggedIn(false);

        if (selfInitiated === true || selfInitiated === undefined) {
            storage.set("sessionID", "");
            storage.set("loggedIn", false);
            channel.postMessage({ type: "LOGOUT", payload: null });
        }
    }

    const { name, email } = user;
    return !loggedIn ? (
        <Router>
            <Home path="/" login={login} />
        </Router>
    ) : (
        <div>
            <NavBar name={name} email={email} logout={logout} />
            <Router>
                <Dashboard path="/" user={user} setUser={setUser} />
            </Router>
        </div>
    );
}

export default hot(module)(App);
