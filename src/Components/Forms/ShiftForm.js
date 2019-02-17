import React from "react";
import style from "./ShiftForm.scss";
import { withFormik } from "formik";
import { object } from "yup";
import { api } from "../../utils/api";
import moment from "moment";
import Input from "../Controls/Input";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimeField from "react-simple-timefield";

function InnerForm({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue
}) {
    console.log(values);
    return (
        <form onSubmit={handleSubmit}>
            <div className={style["container"]}>
                <DatePicker
                    name="startDate"
                    className={style["date"]}
                    dateFormat="dddd, MMMM Do YYYY"
                    selected={values.startDate}
                    onChange={date => setFieldValue("startDate", date)}
                    minDate={moment()}
                />
                <div className={style["times"]}>
                    <div className={style["wrapper"]}>
                        <TimeField
                            name="startTime"
                            value={values.startTime}
                            onChange={handleChange}
                            input={<Input label="Start Time" small />}
                        />
                    </div>

                    <div className={style["wrapper"]}>
                        <TimeField
                            name="endTime"
                            value={values.endTime}
                            onChange={handleChange}
                            input={<Input label="End Time" small />}
                        />
                    </div>
                </div>

                <div className={style["wrapper"]}>
                    <Input
                        name="breakLength"
                        label="Break Length"
                        value={values.breakLength}
                        invalid={touched.breakLength && errors.breakLength}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        small={true}
                    />
                </div>
            </div>
        </form>
    );
}

const ShiftForm = withFormik({
    mapPropsToValues: () => ({
        startDate: moment(),
        startTime: "09:00",
        endTime: "09:00",
        breakLength: ""
    }),
    handleSubmit: (values, { setSubmitting }) => {
        console.log(submitting);
        api.post("/shifts", values).then(response => {
            setSubmitting(false);
            console.log(response.data);
        });
    }
})(InnerForm);

export default ShiftForm;
