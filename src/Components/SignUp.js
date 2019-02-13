import React from "react";
import style from "./SignUp.scss";
import classnames from "classnames";

import Input from "./Controls/Input";
import Button from "./Controls/Button";

function SignUp() {
    return (
        <>
            <div className={style["heading"]}>Create an account.</div>
            <div className={style["container"]}>
                <Input name="name" label="Name" type="text" value="" />
                <Input name="email" label="Email" type="email" value="" />
                <Input
                    name="password"
                    label="Password"
                    type="password"
                    value=""
                    hint="Must contain at least six characters"
                />
                <Input
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value=""
                    hint="Re-type your password to make sure it's correct"
                />
                <Button>Sign Up</Button>
            </div>
        </>
    );
}

export default SignUp;
