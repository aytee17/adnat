import React from "react";
import style from "./Button.scss";
import classnames from "classnames";

function Button({ active, small, children, ...props }) {
    const className = classnames(style["button"], {
        [style["active"]]: active,
        [style["small"]]: small
    });
    return (
        <button className={className} {...props}>
            {children}
        </button>
    );
}

export default Button;
