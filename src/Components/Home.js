import React from "react";
import style from "./Home.scss";

import Logo from "./Logo";
import Login from "./Login";
import SignUp from "./SignUp";

function Home() {
    return (
        <>
            <div className={style["container"]}>
                <div className={style["top"]}>
                    <Logo />
                    <Login />
                </div>
            </div>

            <div className={style["bottom"]}>
                <SignUp />
            </div>
        </>
    );
}

export default Home;
