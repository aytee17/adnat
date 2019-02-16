import React from "react";
import style from "./MenuButton.scss";
import classnames from "classnames";
import { AccountIcon } from "./Icons/Icons";
import { DownIcon } from "./Icons/Icons";
import useClickOutside from "./Hooks/useClickOutside";

export function MenuButton({ children }) {
    const [ref, open, toggle] = useClickOutside();
    const className = classnames(style["button"], {
        [style["open"]]: open
    });
    return (
        <div className={className} onClick={toggle} ref={ref}>
            <AccountIcon />
            <DownIcon open={open} />
            <Menu open={open}>{children}</Menu>
        </div>
    );
}

const Menu = ({ open, children }) => {
    const classNames = classnames(style["menu"], {
        [style["open"]]: open
    });

    return <div className={classNames}>{children}</div>;
};

export const MenuItem = ({ top, children, ...props }) => {
    const classNames = classnames(style["menu-item"], {
        [style["top"]]: top
    });

    return (
        <div className={classNames} {...props}>
            {children}
        </div>
    );
};

export default MenuButton;
