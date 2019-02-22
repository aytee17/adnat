import React, { useState } from "react";
import Button from "../Controls/Button";
import { Link } from "@reach/router";
import style from "./UserDetails.scss";
import UserForm from "../Forms/UserForm";

function UserDetails({ user, updateUser }) {
    const [editing, setEditing] = useState(false);

    const { name, email } = user;

    return (
        <div className={style["container"]}>
            <div className={style["header"]}>Account Information</div>
            <Link to="/">Back to Dashboard</Link>
            {!editing ? (
                <div className={style["details"]}>
                    <div className={style["name"]}>{name}</div>
                    <div className={style["email"]}>{email}</div>
                    <Button small onClick={() => setEditing(true)}>
                        Edit
                    </Button>
                </div>
            ) : (
                <UserForm
                    user={user}
                    setEditing={setEditing}
                    updateUser={updateUser}
                />
            )}
            <Link to="/change_password">Change Password</Link>
        </div>
    );
}

export default UserDetails;
