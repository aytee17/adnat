import React from "react";
import style from "./ShiftForm.scss";
import { withFormik } from "formik";
import { object, number, string } from "yup";
import { api } from "../../utils/api";
import { convertToMinutes, absTimeDiff } from "../../utils/time";
import moment from "moment";
import Input from "../Controls/Input";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimeField from "react-simple-timefield";
import Button from "../Controls/Button";
import { CREATE, UPDATE } from "../../enums/enum";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";

function InnerForm({
    values,
    errors,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    handleBlur,
    mode
}) {
    const allErrors = Object.values(errors);

    let sumbitTitle;
    switch (mode) {
        case CREATE:
            sumbitTitle = "Create Shift";
            break;
        case UPDATE:
            sumbitTitle = "Update Shift";
            break;
        default:
            sumbitTitle = "";
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={style["container"]}>
                <div className={style["inputs"]}>
                    <div>
                        <DatePicker
                            name="startDate"
                            className={style["date"]}
                            dateFormat="ddd - DD/MM/YY"
                            selected={values.startDate}
                            onChange={date => setFieldValue("startDate", date)}
                            minDate={moment()}
                            disabled={isSubmitting}
                        />
                        <div className={style["label"]}>Date</div>
                    </div>
                    <div className={style["times"]}>
                        <div className={style["wrapper"]}>
                            <TimeField
                                name="startTime"
                                value={values.startTime}
                                onChange={value => {
                                    setFieldValue("startTime", value);
                                }}
                                input={
                                    <Input
                                        label="Start Time"
                                        small
                                        hint="hh:mm"
                                    />
                                }
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className={style["wrapper"]}>
                            <TimeField
                                name="endTime"
                                value={values.endTime}
                                onChange={value =>
                                    setFieldValue("endTime", value)
                                }
                                input={
                                    <Input
                                        label="End Time"
                                        small
                                        hint="hh:mm"
                                        onBlur={handleBlur}
                                    />
                                }
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <Input
                        name="breakLength"
                        style={{ width: "80px" }}
                        small={true}
                        label="Break"
                        hint="Minutes"
                        value={values.breakLength}
                        onChange={event => {
                            let { value } = event.target;

                            const regex = /^$|^[1-9]\d*?$/;
                            const matches = regex.test(value);

                            if (value !== "") {
                                value = parseInt(value);
                            }
                            if (matches) {
                                setFieldValue("breakLength", value);
                            }
                        }}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                    />
                    <Button type="submit" small={true}>
                        {sumbitTitle}
                    </Button>
                </div>
                <div className={style["errors"]}>
                    {allErrors.map(error => (
                        <div>{error}</div>
                    ))}
                </div>
            </div>
        </form>
    );
}

const ShiftForm = withFormik({
    enableReinitialize: true,
    mapPropsToValues: props => {
        let shiftDate, startTime, endTime, breakLength;
        if (props.shift) {
            const { shift } = props;
            shiftDate = moment(shift.shiftDate);
            startTime = shift.startTime;
            endTime = shift.endTime;
            breakLength = shift.breakLength;
        } else {
            shiftDate = moment();
            startTime = "09:00";
            endTime = "17:00";
            breakLength = "";
        }
        return { startDate: shiftDate, startTime, endTime, breakLength };
    },
    validationSchema: object().shape({
        endTime: string().when("startTime", (startTime, schema) => {
            return schema.test(
                "end time is not equal to start time",
                "Can't start and finish at the same time",
                endTime => {
                    return endTime !== startTime;
                }
            );
        }),
        breakLength: number("should be number").when(
            ["startTime", "endTime"],
            (startTime, endTime, schema) => {
                const difference = absTimeDiff(startTime, endTime);
                return schema.test(
                    "break is shorter than shift",
                    `A break can't be longer than the duration of the shift`,
                    breakLength => {
                        if (breakLength === undefined || difference === 0)
                            return true;
                        return difference - breakLength > 0;
                    }
                );
            }
        )
    }),
    handleSubmit: (values, { props, setSubmitting }) => {
        let finishDate = moment(values.startDate);
        const startTime = convertToMinutes(values.startTime);
        const endTime = convertToMinutes(values.endTime);
        if (startTime > endTime) {
            finishDate.add(1, "days");
        }
        const format = "YYYY-MM-DD";
        let startDate = values.startDate.format(format);
        finishDate = finishDate.format(format);

        const transformedValues = {
            start: `${startDate} ${values.startTime}`,
            finish: `${finishDate} ${values.endTime}`
        };

        if (values.breakLength !== "")
            transformedValues.breakLength = values.breakLength;

        if (props.mode === CREATE) {
            transformedValues.userId = props.user.id;
            api.post("/shifts", transformedValues).then(response => {
                setSubmitting(false);
                const shift = response.data;
                props.addShift(shift);
            });
        } else if (props.mode === UPDATE) {
            const { shift: currentShift } = props;

            const originalValues = props.shifts.find(
                shift => shift.id === currentShift.id
            );

            const comparison = ["start", "finish", "breakLength"];
            const body = {};

            comparison.forEach(key => {
                if (originalValues[key] !== transformedValues[key]) {
                    body[key] = transformedValues[key];
                    originalValues[key] = transformedValues[key];
                }
            });

            if (!isEmpty(body)) {
                api.put(`/shifts/${currentShift.id}`, body).then(response => {
                    setSubmitting(false);
                    props.resetEditing(true, currentShift.id);
                    if (isEqual(response.data, originalValues)) {
                        props.setShifts(shifts);
                    }
                });
            } else {
                setSubmitting(false);
                props.resetEditing();
            }
        }
    }
})(InnerForm);

export default ShiftForm;
