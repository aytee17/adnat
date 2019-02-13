import React, { useState } from "react";
import style from "./Login.scss";
import classnames from "classnames";

import Input from "./Controls/Input";
import { MailIcon, LockIcon } from "./Icons/Icons";
import Button from "./Controls/Button";
import { Link } from "@reach/router";
import Logo from "./Logo";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div>
            <div className={style["container"]}>
                <Input
                    style={{
                        width: "250px"
                    }}
                    label={"Email"}
                    name="email"
                    type="email"
                    required={true}
                    icon={true}
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                >
                    <MailIcon />
                </Input>
                <Input
                    style={{
                        width: "250px"
                    }}
                    label={"Password"}
                    name="password"
                    type="password"
                    required={true}
                    icon={true}
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                >
                    <LockIcon />
                </Input>
                <Button style={{ width: "80px" }}>Login ❯</Button>
            </div>
            <div className={style["second-container"]}>
                <div className={style["forgot-password"]}>
                    <Link to="/forgot_password">
                        <span style={{ color: "grey" }}>Forgot password?</span>
                    </Link>
                </div>
                <div className={style["remember"]}>
                    <input type="checkbox" />
                    <span>Remember me</span>
                </div>
            </div>
        </div>
    );
}

export default Login;
