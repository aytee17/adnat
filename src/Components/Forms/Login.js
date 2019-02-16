import React from "react";
import style from "./Login.scss";

import { withFormik } from "formik";
import { object, string, bool } from "yup";

import Input from "../Controls/Input";
import { MailIcon, LockIcon, VisibilityIcon } from "../Icons/Icons";
import Button from "../Controls/Button";
import { api } from "../../utils/api";
import { Link } from "@reach/router";

function InnerForm({
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    isSubmitting,
    setStatus,
    status = { visiblePassword: false }
}) {
    return (
        <form onSubmit={handleSubmit}>
            <div className={style["container"]}>
                <Input
                    style={{
                        width: "250px"
                    }}
                    label="Email"
                    name="email"
                    type="email"
                    required={true}
                    icon={true}
                    invalid={touched.email && errors.email}
                    errorMessage={errors.email}
                    disabled={isSubmitting}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    spellCheck="false"
                    autoCorrect="false"
                    autoCapitalize="false"
                >
                    <MailIcon />
                </Input>
                <Input
                    style={{
                        width: "250px"
                    }}
                    label="Password"
                    name="password"
                    type={status.visiblePassword ? "text" : "password"}
                    required={true}
                    icon={true}
                    disabled={isSubmitting}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.password && errors.password}
                    errorMessage={errors.password}
                    spellCheck="false"
                    autoCorrect="false"
                    autoCapitalize="false"
                >
                    <LockIcon />
                    <VisibilityIcon
                        visiblePassword={status.visiblePassword}
                        setVisiblePassword={value =>
                            setStatus({ visiblePassword: value })
                        }
                    />
                </Input>
                <Button
                    style={{ width: "80px", marginTop: "20px" }}
                    type="submit"
                    disabled={isSubmitting}
                    formNoValidate={true}
                >
                    Login ❯
                </Button>
            </div>
            <div className={style["second-container"]}>
                <div className={style["forgot-password"]}>
                    <Link to="/forgot_password">
                        <span style={{ color: "grey" }}>Forgot password?</span>
                    </Link>
                </div>
                <div className={style["remember"]}>
                    <input
                        type="checkbox"
                        disabled={isSubmitting}
                        defaultChecked={values.remember}
                        onChange={handleChange}
                    />
                    <span>Remember me</span>
                </div>
            </div>
        </form>
    );
}

const Login = withFormik({
    mapPropsToValues: () => ({
        email: "",
        password: "",
        remember: true
    }),
    validationSchema: object().shape({
        email: string()
            .email("Incorrect email address structure")
            .required("Enter your email address"),
        password: string().required("Enter your password"),
        remember: bool()
    }),
    handleSubmit: (values, { props, setSubmitting, setErrors, setStatus }) => {
        setStatus({ visiblePassword: false });

        api.post("/auth/login", {
            ...values,
            email: values.email.trim()
        }).then(response => {
            setSubmitting(false);
            props.login(response.data.sessionId);
        });
    }
})(InnerForm);

export default Login;
