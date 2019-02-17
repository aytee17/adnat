import React from "react";
import style from "./ShiftList.scss";
import ShiftForm from "../Forms/ShiftForm";

function ShiftList({ shifts }) {
    return (
        <div>
            <div>Shifts</div>
            <ShiftForm />
        </div>
    );
}

export default ShiftList;
