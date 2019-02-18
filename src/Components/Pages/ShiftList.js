import React from "react";
import style from "./ShiftList.scss";
import ShiftForm from "../Forms/ShiftForm";

function ShiftList({ user }) {
    return (
        <div>
            <ShiftForm user={user} />
        </div>
    );
}

export default ShiftList;
