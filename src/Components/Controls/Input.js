import React from "react";
import style from "./Input.scss";
import classnames from "classnames";

function Input({ label, name, icon, errorMessage, children, ...props }) {
    const className = classnames(style["input"], {
        [style["with-icon"]]: icon
    });
    return (
        <div className={style["container"]}>
            <input className={className} placeholder={label} {...props} />
            <div className={style["label"]}>
                <label htmlFor={label}>{label}</label>
            </div>
            {children}
        </div>
    );
}

export default Input;
