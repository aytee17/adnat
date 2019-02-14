import React from "react";
import style from "./Logo.scss";
import classnames from "classnames";

const Logo = ({ small, white }) => {
    const className = classnames(style["logo"], {
        [style["white"]]: white,
        [style["small"]]: small
    });
    return <div className={className}>Adnat</div>;
};

export default Logo;
