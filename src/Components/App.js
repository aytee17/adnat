import React, { useState, useEffect } from "react";
import SecureLS from "secure-ls";
import { Router, navigate } from "@reach/router";
import { hot } from "react-hot-loader";
import { api, setAuth } from "../utils/api";

import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import UserDetails from "./Pages/UserDetails";
import ChangePassword from "./Pages/ChangePassword";
import NavBar from "./NavBar";
import PageLayout from "./PageLayout";

const storage = new SecureLS({ encodingType: "aes" });
const channel = new BroadcastChannel("session");

function App() {
    // Check login state from local storage, and get + set session id if logged in
    const [loggedIn, setLoggedIn] = useState(() => {
        const alreadyIn = storage.get("loggedIn");
        if (alreadyIn === true) {
            const sessionID = storage.get("sessionID");
            setAuth(sessionID);
            return true;
        }
        return false;
    });

    // User not loaded yet
    const [user, setUser] = useState({
        name: "",
        email: "",
        organisationId: null,
        loaded: false
    });

    // Fetch user if logged in
    useEffect(() => {
        if (loggedIn) {
            api.get("/users/me").then(response => {
                setUser(response.data);
            });
        }
    }, [loggedIn]);

    // Listen for login and logout from other browsing contexts
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

    /**
     * @param selfInitiated set to false if called in response to a broadcast message
     **/
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
        navigate("/");
    }

    const updateUser = update => setUser({ ...user, ...update });

    const { name, email } = user;
    return !loggedIn ? (
        <Router>
            <Home path="/" login={login} />
        </Router>
    ) : (
        <div>
            <NavBar name={name} email={email} logout={logout} />
            <PageLayout>
                <Router>
                    <Dashboard path="/" user={user} updateUser={updateUser} />
                    <UserDetails
                        path="/user_details"
                        user={user}
                        updateUser={updateUser}
                    />
                    <ChangePassword path="/change_password" />
                </Router>
            </PageLayout>
        </div>
    );
}

export default hot(module)(App);
