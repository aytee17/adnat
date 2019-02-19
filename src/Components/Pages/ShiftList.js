import React, { useState, useEffect } from "react";
import style from "./ShiftList.scss";
import classnames from "classnames";
import ShiftForm from "../Forms/ShiftForm";
import { api } from "../../utils/api";
import mapKeys from "lodash.mapkeys";
import { absTimeDiff, convertToMinutes } from "../../utils/time";
import { CREATE, UPDATE } from "../../enums/enum";

function getTime(date) {
    return new Date(date).getTime();
}

function ShiftList({ user, org }) {
    const [shifts, setShifts] = useState([]);
    const [users, setUsers] = useState({});
    const [editing, setEditing] = useState(-1);

    const addShift = shift => setShifts([...shifts, shift]);
    const editShift = shiftID => () => setEditing(shiftID);
    const resetEditing = () => setEditing(-1);

    useEffect(() => {
        Promise.all([api.get("/shifts"), api.get("/users")]).then(responses => {
            const users = mapKeys(responses[1].data, "id");
            const shifts = responses[0].data;
            setUsers(users);
            setShifts(shifts);
        });
    }, []);

    const processedShifts = shifts
        .map(shift => {
            const { id, userId } = shift;
            const breakLength = parseInt(shift.breakLength) || 0;
            const [shiftDate, startTime] = shift.start.split(" ");
            const endTime = shift.finish.split(" ")[1];
            const hoursWorked = getHoursWorked(startTime, endTime, breakLength);
            const shiftCost = getShiftCost(hoursWorked, org.hourlyRate);

            return {
                id,
                userId,
                shiftDate,
                startTime,
                endTime,
                breakLength,
                hoursWorked,
                shiftCost,
                breakLength
            };
        })
        .sort((a, b) => {
            let diff = getTime(b.shiftDate) - getTime(a.shiftDate);
            if (diff === 0) {
                diff =
                    convertToMinutes(b.startTime) -
                    convertToMinutes(a.startTime);
            }
            return diff;
        });

    function renderShifts() {
        return processedShifts.map(shift => {
            const {
                id,
                userId,
                shiftDate,
                startTime,
                endTime,
                breakLength,
                hoursWorked,
                shiftCost
            } = shift;

            const isActiveRow = editing === id;
            const isEditing = editing >= 0;

            const className = classnames(style["shift-row"], {
                [style["active-row"]]: isActiveRow,
                [style["faded-row"]]: isEditing && !isActiveRow
            });

            const convertDateFormat = date =>
                date
                    .split("-")
                    .reverse()
                    .join("/");

            return (
                <tr key={id} className={className}>
                    <td className={style[""]}>{users[userId].name}</td>
                    <td className={style["cell-center"]}>
                        {convertDateFormat(shiftDate)}
                    </td>
                    <td className={style["cell-center"]}>{startTime}</td>
                    <td className={style["cell-center"]}>{endTime}</td>
                    <td className={style["cell-right"]}>{breakLength}</td>
                    <td className={style["cell-right"]}>{hoursWorked}</td>
                    <td className={style["cell-right"]}>{shiftCost}</td>
                    <td className={style["cell-right"]}>
                        {!(isEditing && !isActiveRow) && (
                            <div className={style["controls"]}>
                                <div
                                    className={style["control"]}
                                    onClick={
                                        isActiveRow
                                            ? () => resetEditing()
                                            : editShift(id)
                                    }
                                >
                                    {isActiveRow ? "Cancel" : "Edit"}
                                </div>
                                {!isEditing && (
                                    <div className={style["control"]}>
                                        Delete
                                    </div>
                                )}
                            </div>
                        )}
                    </td>
                </tr>
            );
        });
    }

    const columns = [
        "Name",
        "Shift Date",
        "Start Time",
        "Finish Time",
        "Break Length",
        "Hours Worked",
        "Shift Cost",
        ""
    ];

    const isEditing = editing > -1;
    return (
        <div className={style["container"]}>
            <div className={style["table-container"]}>
                <table className={style["shifts"]}>
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={style["column-header"]}
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={style["shifts-body"]}>
                        {renderShifts()}
                    </tbody>
                </table>
            </div>
            <ShiftForm
                user={user}
                addShift={addShift}
                mode={isEditing ? UPDATE : CREATE}
                shift={
                    isEditing
                        ? processedShifts.find(shift => shift.id === editing)
                        : undefined
                }
                resetEditing={resetEditing}
                shifts={shifts}
                setShifts={setShifts}
            />
        </div>
    );
}

function getHoursWorked(startTime, endTime, breakLength) {
    let hoursWorked = (
        absTimeDiff(startTime, endTime) / 60 -
        breakLength / 60
    ).toFixed(2);

    const [first, second] = hoursWorked.split(".");
    if (second === "00") {
        hoursWorked = first;
    }
    return hoursWorked;
}

function getShiftCost(hoursWorked, hourlyRate) {
    const shiftCost = parseFloat(hoursWorked) * parseFloat(hourlyRate);
    return shiftCost.toFixed(2);
}

export default ShiftList;
