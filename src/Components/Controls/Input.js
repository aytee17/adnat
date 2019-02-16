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
    small,
    children,
    ...props
}) {
    const inputClassName = classnames(style["input"], {
        [style["with-icon"]]: icon,
        [style["with-symbol"]]: symbol,
        [style["small"]]: small
    });

    const messageClassName = classnames(style["hint"], {
        [style["error"]]: errorMessage
    });

    const labelClassName = classnames({
        [style["label"]]: !small,
        [style["small-label"]]: small
    });

    return (
        <div className={style["container"]}>
            <input
                className={inputClassName}
                placeholder={label}
                name={name}
                {...props}
            />
            {correct && (
                <span className={style["tick"]}>
                    <TickIcon />
                </span>
            )}
            <div className={labelClassName}>
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
