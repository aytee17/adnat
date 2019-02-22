import React from "react";
import style from "./NavBar.scss";
import { MenuButton, MenuItem } from "./MenuButton";
import Logo from "./Logo";
import { api } from "../utils/api";
import { Link } from "@reach/router";

function NavBar({ name, email, logout }) {
    function handleLogout() {
        api.delete("auth/logout").then(response => {
            if (response.status === 200) logout();
        });
    }

    return (
        <div className={style["bar"]}>
            <div className={style["container"]}>
                <Logo small white />
                <MenuButton>
                    <MenuItem top={true}>
                        <Link to="/user_details">
                            <div>{name}</div>
                            <div style={{ fontSize: "13px" }}>{email}</div>
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuButton>
            </div>
        </div>
    );
}

export default NavBar;
