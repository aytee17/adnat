import React from "react";
import style from "./NavBar.scss";
import { MenuButton, MenuItem } from "./MenuButton";

function NavBar({ name, email, logout }) {
    return (
        <div className={style["bar"]}>
            <div className={style["container"]}>
                <div>Adnat</div>
                <MenuButton>
                    <MenuItem top={true}>
                        <div>{name}</div>
                        <div style={{ fontSize: "13px" }}>{email}</div>
                    </MenuItem>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuButton>
            </div>
        </div>
    );
}

export default NavBar;
