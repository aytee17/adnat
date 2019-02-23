import React from "react";
import style from "./Error.scss";

function Error({ children, ...props }) {
    return (
        <div className={style["error"]} {...props}>
            {children}
        </div>
    );
}

export default Error;
