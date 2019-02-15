import React from "react";
import style from "./OrgForm.scss";
import classnames from "classnames";
import { withFormik } from "formik";
import { object, string, number } from "yup";
import { api } from "../../utils/api";

import Input from "../Controls/Input";
import Button from "../Controls/Button";

function fixRateInput(value) {
    if (value === "") return value;

    const second = value.split(".")[1];
    if (second === undefined) {
        value = `${value}.00`;
    } else if (second === "") {
        value = `${value}00`;
    } else if (second.length === 1) {
        value = `${value}0`;
    }
    return value;
}

const InnerForm = ({
    formOpened,
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    isSubmitting
}) => {
    const className = classnames(style["form"], {
        [style["show"]]: formOpened
    });

    function onHourlyRateChange(event) {
        const { value } = event.target;
        const regex = /^$|^[1-9]\d*\.?(\d{1,2})?$/;
        const matches = regex.test(value);
        if (matches) setFieldValue("hourlyRate", value);
    }

    function onHourlyRateBlur(event) {
        handleBlur(event);
        let { value } = event.target;
        value = fixRateInput(value);
        setFieldValue("hourlyRate", value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={className}>
                <Input
                    name="name"
                    type="text"
                    label="Organisation Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.name && errors.name}
                    errorMessage={errors.name}
                    disabled={isSubmitting}
                />
                <Input
                    style={{ width: "130px" }}
                    name="hourlyRate"
                    label="Hourly Rate"
                    type="text"
                    symbol
                    disabled={isSubmitting}
                    value={values.hourlyRate}
                    onChange={onHourlyRateChange}
                    onBlur={onHourlyRateBlur}
                    invalid={touched.hourlyRate && errors.hourlyRate}
                    errorMessage={errors.hourlyRate}
                >
                    <div className={style["symbol"]}>$</div>
                </Input>
                <Button
                    style={{
                        width: "180px",
                        marginLeft: "138px"
                    }}
                    type="submit"
                    formNoValidate
                >
                    Create and Join
                </Button>
            </div>
        </form>
    );
};

const OrgForm = withFormik({
    mapPropsToValues: () => ({
        name: "",
        hourlyRate: ""
    }),
    validationSchema: object().shape({
        name: string().required("A name is required"),
        hourlyRate: number().required("An hourly rate is required")
    }),
    handleSubmit: (values, { props, setSubmitting, setFieldValue }) => {
        const hourlyRate = fixRateInput(values.hourlyRate);
        setFieldValue("hourlyRate", hourlyRate);
        const transformedValues = {
            ...values,
            hourlyRate
        };
        api.post("/organisations/create_join", transformedValues)
            .then(response => {
                setSubmitting(false);
                return api.get("users/me");
            })
            .then(response => {
                props.setUser(response.data);
            });
    }
})(InnerForm);

export default OrgForm;
