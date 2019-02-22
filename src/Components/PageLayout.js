import React from "react";
import style from "./PageLayout.scss";

function PageLayout({ children }) {
    return <div className={style["container"]}>{children}</div>;
}

export default PageLayout;
