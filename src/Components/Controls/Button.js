import React from "react";
import style from "./Button.scss";
import classnames from "classnames";

function Button({ active, children, ...props }) {
    const className = classnames(style["button"], {
        [style["active"]]: active
    });
    return (
        <button className={className} {...props}>
            {children}
        </button>
    );
}

export default Button;
