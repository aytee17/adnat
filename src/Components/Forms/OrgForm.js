import React from "react";
import style from "./OrgForm.scss";
import classnames from "classnames";
import { Formik } from "formik";
import { object, string, number } from "yup";
import { api } from "../../utils/api";
import { CREATE, UPDATE } from "../../enums/enum";

import Input from "../Controls/Input";
import Button from "../Controls/Button";
import fixRate from "../../utils/fixRate";

const OrgForm = React.forwardRef(
    (
        {
            org,
            mode,
            formOpened,
            organisations,
            setOrganisations,
            user,
            setUser,
            toggleForm
        },
        ref
    ) => {
        let name, hourlyRate;
        if (org) {
            name = org.name;
            hourlyRate = org.hourlyRate;
        } else {
            name = "";
            hourlyRate = "";
        }
        return (
            <Formik
                initialValues={{ name, hourlyRate }}
                initialStatus={{ error: "" }}
                validationSchema={object().shape({
                    name: string().required("A name is required"),
                    hourlyRate: number().required("An hourly rate is required")
                })}
                onSubmit={(
                    values,
                    { setSubmitting, setFieldValue, setStatus }
                ) => {
                    const hourlyRate = fixRate(values.hourlyRate);
                    setFieldValue("hourlyRate", hourlyRate);
                    const transformedValues = {
                        ...values,
                        hourlyRate
                    };

                    if (mode === CREATE) {
                        api.post(
                            "/organisations/create_join",
                            transformedValues
                        )
                            .then(response => {
                                setSubmitting(false);
                                const organisation = response.data;
                                const { id } = organisation;
                                setOrganisations({
                                    ...organisations,
                                    [id]: organisation
                                });
                                setUser({
                                    ...user,
                                    organisationId: id
                                });
                                toggleForm();
                            })
                            .catch(error => {
                                setSubmitting(false);
                                setStatus({ error: error.response.data.error });
                            });
                    } else if (mode === UPDATE) {
                        const modified =
                            values.name !== org.name ||
                            hourlyRate !== org.hourlyRate;
                        if (modified) {
                            api.put(
                                `/organisations/${org.id}`,
                                transformedValues
                            )
                                .then(response => {
                                    setSubmitting(false);
                                    if (response.data === "OK") {
                                        const { id } = org;
                                        const newList = {
                                            ...organisations,
                                            [id]: { id, ...transformedValues }
                                        };
                                        setOrganisations(newList);
                                        toggleForm();
                                    }
                                })
                                .catch(error => {});
                        }
                    } else {
                        setSubmitting(false);
                        toggleForm();
                    }
                }}
                render={({
                    values,
                    errors,
                    touched,
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    isSubmitting,
                    status
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
                            <div ref={ref} className={className}>
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
                                    invalid={
                                        touched.hourlyRate && errors.hourlyRate
                                    }
                                    errorMessage={errors.hourlyRate}
                                >
                                    <div className={style["symbol"]}>$</div>
                                </Input>
                                <div className={style["error"]}>
                                    {status.error}
                                </div>
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
                }}
            />
        );
    }
);

export default OrgForm;
