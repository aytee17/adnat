import React from "react";
import style from "./Home.scss";

import Logo from "../Logo";
import Login from "../Forms/Login";
import SignUp from "../Forms/SignUp";

import { Link } from "@reach/router";

function Home({ login }) {
    return (
        <React.Fragment>
            <div className={style["container"]}>
                <div className={style["top"]}>
                    <Logo />
                    <Login login={login} />
                </div>
            </div>

            <div className={style["bottom"]}>
                <SignUp login={login} />
            </div>
        </React.Fragment>
    );
}

export default Home;
