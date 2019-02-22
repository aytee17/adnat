import React, { useState } from "react";
import ChangePasswordForm from "../Forms/ChangePasswordForm";
import { Link } from "@reach/router";

function ChangePassword() {
    const [changed, setChanged] = useState(false);
    return (
        <div>
            {changed ? (
                <div>
                    <div>Your password has been changed</div>
                    <Link to="/">Back to Dashboard</Link>
                </div>
            ) : (
                <div>
                    <div>Change Password</div>
                    <ChangePasswordForm setChanged={setChanged} />
                </div>
            )}
        </div>
    );
}

export default ChangePassword;
