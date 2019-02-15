import React from "react";
import style from "./OrgForm.scss";
import classnames from "classnames";
import { withFormik } from "formik";
import { object, string, number } from "yup";
import { api } from "../../utils/api";
import { CREATE, UPDATE } from "../../enums/enum";

import Input from "../Controls/Input";
import Button from "../Controls/Button";
import fixRate from "../../utils/fixRate";

const InnerForm = ({
    formOpened,
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    isSubmitting,
    mode
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
        value = fixRate(value);
        setFieldValue("hourlyRate", value);
    }

    let sumbitTitle;
    switch (mode) {
        case CREATE:
            sumbitTitle = "Create and Join";
            break;
        case UPDATE:
            sumbitTitle = "Update";
            break;
        default:
            sumbitTitle = "";
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
                    {sumbitTitle}
                </Button>
            </div>
        </form>
    );
};

const OrgForm = withFormik({
    mapPropsToValues: ({ org }) => {
        let name, hourlyRate;
        if (org) {
            name = org.name;
            hourlyRate = org.hourlyRate;
        } else {
            name = "";
            hourlyRate = "";
        }
        return { name, hourlyRate };
    },
    validationSchema: object().shape({
        name: string().required("A name is required"),
        hourlyRate: number().required("An hourly rate is required")
    }),
    handleSubmit: (values, { props, setSubmitting, setFieldValue }) => {
        const hourlyRate = fixRate(values.hourlyRate);
        setFieldValue("hourlyRate", hourlyRate);
        const transformedValues = {
            ...values,
            hourlyRate
        };

        if (props.mode === CREATE) {
            api.post("/organisations/create_join", transformedValues).then(
                response => {
                    setSubmitting(false);
                    const organisation = response.data;
                    const { id } = organisation;
                    const {
                        organisations,
                        setOrganisations,
                        user,
                        setUser
                    } = props;
                    setOrganisations({
                        ...organisations,
                        [id]: organisation
                    });
                    setUser({
                        ...user,
                        organisationID: id
                    });
                }
            );
        }

        if (props.mode === UPDATE) {
            api.put(`/organisations/${props.org.id}`, transformedValues).then(
                response => {
                    setSubmitting(false);
                    if (response.data === "OK") {
                        const { id } = props.org;
                        const { organisations, setOrganisations } = props;
                        const newList = {
                            ...organisations,
                            [id]: { id, ...transformedValues }
                        };
                        setOrganisations(newList);
                        props.toggleForm();
                    }
                }
            );
        }
    }
})(InnerForm);

export default OrgForm;
