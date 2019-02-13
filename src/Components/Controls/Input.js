import React from "react";
import style from "./Input.scss";
import classnames from "classnames";

function Input({
    label,
    name,
    icon,
    hint,
    invalid,
    errorMessage,
    children,
    ...props
}) {
    const className = classnames(style["input"], {
        [style["with-icon"]]: icon
    });

    const messageClassName = classnames([style["hint"]], {
        [style["error"]]: errorMessage
    });

    return (
        <div className={style["container"]}>
            <input
                className={className}
                placeholder={label}
                name={name}
                {...props}
            />
            <div className={style["label"]}>
                <label htmlFor={label}>{label}</label>
            </div>
            {children}
            <div className={messageClassName}>
                {(invalid && errorMessage) || hint}
            </div>
        </div>
    );
}

export default Input;
