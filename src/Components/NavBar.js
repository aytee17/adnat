import React from "react";
import style from "./NavBar.scss";
import { MenuButton, MenuItem } from "./MenuButton";
import { api } from "../utils/api";

function NavBar({ name, email, logout }) {
    function handleLogout() {
        api.delete("auth/logout").then(response => {
            if (response.status === 200) logout();
        });
    }

    return (
        <div className={style["bar"]}>
            <div className={style["container"]}>
                <div>Adnat</div>
                <MenuButton>
                    <MenuItem top={true}>
                        <div>{name}</div>
                        <div style={{ fontSize: "13px" }}>{email}</div>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuButton>
            </div>
        </div>
    );
}

export default NavBar;
