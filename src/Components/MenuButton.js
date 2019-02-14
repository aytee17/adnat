import React, { useState, useRef, useEffect } from "react";
import style from "./MenuButton.scss";
import classnames from "classnames";
import { AccountIcon } from "./Icons/Icons";
import { DownIcon } from "./Icons/Icons";

export function MenuButton({ children }) {
    const [open, setOpen] = useState(false);
    const menuButton = useRef();

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleClickOutside(event) {
        const clickedNode = event.target;
        if (!menuButton.current.contains(clickedNode)) {
            close();
        }
    }

    function close() {
        setOpen(false);
    }

    function toggle() {
        setOpen(!open);
    }

    const className = classnames(style["button"], {
        [style["open"]]: open
    });
    return (
        <div className={className} onClick={toggle} ref={menuButton}>
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
