import React from "react";
import style from "./Input.scss";
import classnames from "classnames";

import { TickIcon } from "../Icons/Icons";

function Input({
    label,
    name,
    icon,
    symbol,
    hint,
    invalid,
    errorMessage,
    correct,
    children,
    ...props
}) {
    const className = classnames(style["input"], {
        [style["with-icon"]]: icon,
        [style["with-symbol"]]: symbol
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
            {correct && (
                <span className={style["tick"]}>
                    <TickIcon />
                </span>
            )}
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
