import React from "react";
import style from "./Button.scss";
import classnames from "classnames";

function Button({ children, ...props }) {
    return (
        <button className={style["button"]} {...props}>
            {children}
        </button>
    );
}

export default Button;
