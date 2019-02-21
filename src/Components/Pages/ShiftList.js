import React, { useState, useEffect, useRef } from "react";
import style from "./ShiftList.scss";
import FilterPanel from "./FilterPanel";
import ShiftRows from "./ShiftRows";
import ShiftForm from "../Forms/ShiftForm";
import { api } from "../../utils/api";
import mapKeys from "lodash.mapkeys";
import {
    getTime,
    getShiftCost,
    getHoursWorked,
    convertToMinutes
} from "../../utils/time";
import { CREATE, UPDATE } from "../../enums/enum";
import useSticky from "../Hooks/useSticky";
import moment from "moment";

function ShiftList({ user, org }) {
    const [shifts, setShifts] = useState([]);
    const [users, setUsers] = useState({});
    const [editing, setEditing] = useState(-1);
    const [userFilterTests, setUserFilterTests] = useState([]);
    const [startDateFilter, setStartDateFilter] = useState(null);
    const [endDateFilter, setEndDateFilter] = useState(null);

    useEffect(() => {
        Promise.all([api.get("/shifts"), api.get("/users")]).then(responses => {
            const users = mapKeys(responses[1].data, "id");
            const shifts = responses[0].data;
            setUsers(users);
            setShifts(shifts);
        });
    }, []);

    const [justUpdated, setJustUpdated] = useState(-1);
    const justCreated = id => {
        rowRefs.current[id].scrollIntoView();
        setJustUpdated(id);
    };
    useEffect(() => {
        if (justUpdated !== -1) {
            window.setTimeout(() => {
                setJustUpdated(-1);
            }, 1000);
        }
    }, [justUpdated]);

    const rowRefs = useRef({});
    const parentRef = useRef();
    const [setRowRef, unSetRowRef, stickStyle] = useSticky(parentRef);

    const addShift = shift => setShifts([...shifts, shift]);

    const editShift = shiftID => () => {
        setEditing(shiftID);
        setRowRef(rowRefs.current[shiftID]);
    };
    const resetEditing = (scrollIntoView, updated) => {
        setEditing(-1);
        setJustUpdated(updated);
        unSetRowRef(scrollIntoView);
    };
    const deleteShift = shiftID => () => {
        api.delete(`shifts/${shiftID}`).then(response => {
            if (response.data === "OK") {
                setShifts(shifts.filter(shift => shift.id !== shiftID));
            }
        });
    };

    const processedShifts = process(
        shifts,
        org.hourlyRate,
        userFilterTests,
        startDateFilter,
        endDateFilter
    );
    const isEditing = editing > -1;
    return (
        <div className={style["container"]}>
            <FilterPanel
                users={users}
                setUserFilterTests={setUserFilterTests}
                startDateFilter={startDateFilter}
                endDateFilter={endDateFilter}
                setStartDateFilter={setStartDateFilter}
                setEndDateFilter={setEndDateFilter}
            />
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
                    <tbody ref={parentRef} className={style["shifts-body"]}>
                        {shifts.length === 0 ? (
                            <div className={style["no-shifts"]}>
                                No shifts to show. Create one below.
                            </div>
                        ) : (
                            <ShiftRows
                                ref={rowRefs}
                                users={users}
                                processedShifts={processedShifts}
                                editing={editing}
                                stickStyle={stickStyle}
                                justUpdated={justUpdated}
                                resetEditing={resetEditing}
                                editShift={editShift}
                                deleteShift={deleteShift}
                            />
                        )}
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
                justCreated={justCreated}
            />
        </div>
    );
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

function process(
    shifts,
    hourlyRate,
    userFilter,
    startDateFilter,
    endDateFilter
) {
    return shifts
        .map(shift => {
            const { id, userId } = shift;
            const breakLength = parseInt(shift.breakLength) || 0;
            const [shiftDate, startTime] = shift.start.split(" ");
            const [endDate, endTime] = shift.finish.split(" ");
            const hoursWorked = getHoursWorked(startTime, endTime, breakLength);
            const shiftCost = getShiftCost(
                shiftDate,
                endDate,
                startTime,
                endTime,
                hourlyRate,
                breakLength,
                hoursWorked
            );

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
        .filter(shift => {
            let containsUser = containsUserInFilter(userFilter, shift);
            let inRange = isWithinRange(shift, startDateFilter, endDateFilter);
            return containsUser && inRange;
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
}

function isWithinRange(shift, start, end) {
    const shiftDate = moment(shift.shiftDate);
    if (start === null && end === null) {
        return true;
    } else if (start === null) {
        return shiftDate.isSameOrBefore(end);
    } else if (end === null) {
        return shiftDate.isSameOrAfter(start);
    }
    return shiftDate.isSameOrBefore(end) && shiftDate.isSameOrAfter(start);
}

function containsUserInFilter(userFilter, shift) {
    if (userFilter.length > 0) {
        return userFilter
            .map(test => test(shift))
            .reduce((acc, result) => acc || result);
    }
    return true;
}

export default ShiftList;
