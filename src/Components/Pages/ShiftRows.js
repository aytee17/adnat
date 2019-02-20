import React from "react";
import style from "./ShiftRows.scss";
import classnames from "classnames";

const ShiftRows = React.forwardRef(
    (
        {
            processedShifts,
            editing,
            justUpdated,
            resetEditing,
            editShift,
            users,
            stickStyle
        },
        ref
    ) => {
        const convertDateFormat = date =>
            date
                .split("-")
                .reverse()
                .join("/");

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
            const isJustUpdated = justUpdated === id;

            const className = classnames(style["shift-row"], {
                [style["active-row"]]: isActiveRow,
                [style["faded-row"]]: isEditing && !isActiveRow,
                [style["just-updated"]]: isJustUpdated
            });

            const classNameForControl = classnames(style["controls"], {
                [style["editing"]]: isEditing
            });

            return (
                <tr
                    key={id}
                    ref={element => {
                        ref.current[id] = element;
                    }}
                    style={isActiveRow ? stickStyle : {}}
                    className={className}
                >
                    <td>{users[userId].name}</td>
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
                            <div className={classNameForControl}>
                                <div
                                    className={style["control"]}
                                    onClick={
                                        isActiveRow
                                            ? () => resetEditing(false)
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
);

export default ShiftRows;
