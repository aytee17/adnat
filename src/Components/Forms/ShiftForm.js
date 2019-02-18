import React from "react";
import style from "./ShiftForm.scss";
import { withFormik } from "formik";
import { object, number, string } from "yup";
import { api } from "../../utils/api";
import moment from "moment";
import Input from "../Controls/Input";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimeField from "react-simple-timefield";
import Button from "../Controls/Button";

function InnerForm({
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    handleBlur
}) {
    return (
        <form onSubmit={handleSubmit}>
            <div className={style["container"]}>
                <div>
                    <DatePicker
                        name="startDate"
                        className={style["date"]}
                        dateFormat="ddd - DD/MM/YY"
                        selected={values.startDate}
                        onChange={date => setFieldValue("startDate", date)}
                        minDate={moment()}
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
                                <Input label="Start Time" small hint="hh:mm" />
                            }
                        />
                    </div>

                    <div className={style["wrapper"]}>
                        <TimeField
                            name="endTime"
                            value={values.endTime}
                            onChange={value => setFieldValue("endTime", value)}
                            input={
                                <Input label="End Time" small hint="hh:mm" />
                            }
                        />
                    </div>
                </div>
                <Input
                    name="breakLength"
                    style={{ width: "80px" }}
                    small={true}
                    label="Break"
                    type="number"
                    hint="Minutes"
                    min={0}
                    invalid={touched.breakLength && errors.breakLength}
                    errorMessage={errors.breakLength}
                    value={values.breakLength}
                    onChange={event => {
                        let { value } = event.target;
                        console.log({ value });
                        if (value !== "") {
                            value = parseInt(value);
                        }
                        setFieldValue("breakLength", value);
                    }}
                    onBlur={handleBlur}
                />
                <Button type="submit" small={true}>
                    Create Shift
                </Button>
            </div>
        </form>
    );
}

const ShiftForm = withFormik({
    mapPropsToValues: () => ({
        startDate: moment(),
        startTime: "04:00",
        endTime: "05:00",
        breakLength: ""
    }),
    validationSchema: object().shape({
        breakLength: number("should be number").when(
            ["startTime", "endTime"],
            (startTime, endTime, schema) => {
                return schema.test(
                    "break is shorter than shift",
                    "Can't be longer than the shift",
                    breakLength => {
                        if (breakLength === undefined) return true;
                        return (
                            absTimeDiff(startTime, endTime) - breakLength > 0
                        );
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
            userId: props.user.id,
            start: `${startDate} ${values.startTime}`,
            finish: `${finishDate} ${values.endTime}`
        };

        if (values.breakLength !== "")
            transformedValues.breakLength = values.breakLength;

        console.log({ transformedValues });

        api.post("/shifts", transformedValues).then(response => {
            setSubmitting(false);
            console.log(response.data);
        });
    }
})(InnerForm);

function convertToMinutes(time) {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    minutes = minutes + hours * 60;
    return minutes;
}

function absTimeDiff(start, end) {
    start = convertToMinutes(start);
    end = convertToMinutes(end);

    if (start > end) {
        return 24 * 60 - start + end;
    }
    return end - start;
}

export default ShiftForm;
