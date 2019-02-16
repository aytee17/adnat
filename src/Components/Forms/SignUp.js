import React from "react";
import style from "./SignUp.scss";

import { withFormik } from "formik";
import { object, string } from "yup";

import Input from "../Controls/Input";
import { VisibilityIcon } from "../Icons/Icons";
import Button from "../Controls/Button";

import { api } from "../../utils/api";

function InnerForm({
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    setStatus,
    status = { visiblePassword: false, visibleConfirmation: false }
}) {
    return (
        <form onSubmit={handleSubmit}>
            <div className={style["heading"]}>Create an account</div>
            <div className={style["container"]}>
                <Input
                    name="name"
                    label="Name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    invalid={touched.name && errors.name}
                    errorMessage={errors.name}
                    onBlur={handleBlur}
                    correct={touched.name && !errors.name}
                />
                <Input
                    name="email"
                    label="Email"
                    type="email"
                    onChange={handleChange}
                    value={values.email}
                    invalid={touched.email && errors.email}
                    errorMessage={errors.email}
                    onBlur={handleBlur}
                    correct={touched.email && !errors.email}
                />
                <Input
                    name="password"
                    label="Password"
                    type={status.visiblePassword ? "text" : "password"}
                    onChange={handleChange}
                    value={values.password}
                    hint="Must contain at least six characters"
                    invalid={touched.password && errors.password}
                    onBlur={handleBlur}
                    errorMessage={errors.password}
                    correct={touched.password && !errors.password}
                >
                    <VisibilityIcon
                        visiblePassword={status.visiblePassword}
                        setVisiblePassword={value =>
                            setStatus({ ...status, visiblePassword: value })
                        }
                    />
                </Input>
                <Input
                    name="passwordConfirmation"
                    label="Confirm Password"
                    type={status.visibleConfirmation ? "text" : "password"}
                    onChange={handleChange}
                    value={values.passwordConfirmation}
                    hint="Re-type your password to make sure it's correct"
                    invalid={
                        touched.passwordConfirmation &&
                        errors.passwordConfirmation
                    }
                    errorMessage={errors.passwordConfirmation}
                    onBlur={handleBlur}
                    correct={
                        touched.passwordConfirmation &&
                        !errors.passwordConfirmation
                    }
                >
                    <VisibilityIcon
                        visiblePassword={status.visibleConfirmation}
                        setVisiblePassword={value =>
                            setStatus({ ...status, visibleConfirmation: value })
                        }
                    />
                </Input>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    formNoValidate={true}
                >
                    Sign Up
                </Button>
            </div>
        </form>
    );
}

const SignUp = withFormik({
    mapPropsToValues: () => ({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: ""
    }),
    validationSchema: object().shape({
        name: string().required("Name is required"),
        email: string()
            .email("Incorrect email structure")
            .required("An email is required"),
        password: string()
            .min(6, "Password is shorter than six characters")
            .required("A password is required"),
        passwordConfirmation: string()
            .required("Please confirm your password")
            .when("password", (password, schema) =>
                schema.test(
                    "passwords match",
                    "Passwords do not match",
                    passwordConfirmation => passwordConfirmation === password
                )
            )
    }),
    handleSubmit: (values, { props, setSubmitting, setErrors, setStatus }) => {
        setStatus({ visiblePassword: false, visibleConfirmation: false });

        api.post("/auth/signup", {
            ...values,
            name: values.name.trim(),
            email: values.email.trim()
        }).then(response => {
            setSubmitting(false);
            props.login(response.data.sessionId);
        });
    }
})(InnerForm);

export default SignUp;
