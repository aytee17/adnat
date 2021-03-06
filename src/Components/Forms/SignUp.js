import React from "react";
import style from "./SignUp.scss";

import { withFormik } from "formik";
import { object } from "yup";

import DetailsFragment from "./DetailsFragment";
import PasswordFragment from "./PasswordFragment";
import { detailsSchema, passwordSchema } from "./schemas";
import Button from "../Controls/Button";

import { api } from "../../utils/api";

const schema = passwordSchema({ newPassword: false });

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
                <DetailsFragment
                    values={values}
                    handleChange={handleChange}
                    touched={touched}
                    errors={errors}
                    handleBlur={handleBlur}
                />
                <PasswordFragment
                    status={status}
                    setStatus={setStatus}
                    values={values}
                    handleChange={handleChange}
                    touched={touched}
                    errors={errors}
                    handleBlur={handleBlur}
                />
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
        ...detailsSchema,
        password: schema.password,
        passwordConfirmation: schema.passwordConfirmation
    }),
    handleSubmit: (values, { props, setSubmitting, setErrors, setStatus }) => {
        setStatus({ visiblePassword: false, visibleConfirmation: false });

        api.post("/auth/signup", {
            ...values,
            name: values.name.trim(),
            email: values.email.trim()
        })
            .then(response => {
                setSubmitting(false);
                props.login(response.data.sessionId);
            })
            .catch(err => {
                setSubmitting(false);
                if (err.response.status === 400) {
                    setErrors({ email: err.response.data.error });
                }
            });
    }
})(InnerForm);

export default SignUp;
