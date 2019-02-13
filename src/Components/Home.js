import React from "react";
import style from "./Home.scss";
import classnames from "classnames";
import Login from "./Login";
import Logo from "./Logo";

function Home() {
    return (
        <>
            <div className={style["background"]} />
            <div className={style["home"]}>
                <div className={style["top"]}>
                    <Logo />
                    <Login />
                </div>
            </div>
        </>
    );
}

export default Home;
