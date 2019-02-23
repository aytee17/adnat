import React from "react";
import style from "./ChangePasswordForm.scss";
import PasswordFragment from "./PasswordFragment";
import Error from "./Error";
import { withFormik } from "formik";
import { object, string } from "yup";
import { passwordSchema } from "./schemas";
import { api } from "../../utils/api";
import Input from "../Controls/Input";
import Button from "../Controls/Button";
import { VisibilityIcon } from "../Icons/Icons";

const schema = passwordSchema({ newPassword: true });

function InnerForm({
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setStatus,
    status = {
        visibleOld: false,
        visiblePassword: false,
        visibleConfirmation: false
    }
}) {
    return (
        <form onSubmit={handleSubmit}>
            <div className={style["container"]}>
                <Input
                    name="oldPassword"
                    label="Password"
                    type={status.visibleOld ? "text" : "password"}
                    onChange={handleChange}
                    value={values.oldPassword}
                    invalid={touched.oldPassword && errors.oldPassword}
                    onBlur={handleBlur}
                    errorMessage={errors.oldPassword}
                >
                    <VisibilityIcon
                        visiblePassword={status.visibleOld}
                        setVisiblePassword={value =>
                            setStatus({ ...status, visibleOld: value })
                        }
                    />
                </Input>
                <PasswordFragment
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    isSubmitting={isSubmitting}
                    status={status}
                    setStatus={setStatus}
                />
                <Error>{errors.general}</Error>
                <Button
                    style={{ marginTop: "12px" }}
                    type="submit"
                    disabled={isSubmitting}
                    formNoValidate={true}
                >
                    Save
                </Button>
            </div>
        </form>
    );
}

const ChangePasswordForm = withFormik({
    mapPropsToValues: () => ({
        oldPassword: "",
        password: "",
        passwordConfirmation: ""
    }),
    validationSchema: object().shape({
        oldPassword: string().required("Enter your password"),
        password: schema.password,
        passwordConfirmation: schema.passwordConfirmation
    }),
    handleSubmit: (values, { props, setSubmitting, setStatus, setErrors }) => {
        setStatus({
            visibleOld: false,
            visiblePassword: false,
            visibleConfirmation: false
        });
        const transformedValues = {
            oldPassword: values.oldPassword,
            newPassword: values.password,
            newPasswordConfirmation: values.passwordConfirmation
        };
        console.log(transformedValues);
        api.put("/users/me/change_password", transformedValues)
            .then(response => {
                setSubmitting(false);
                if (response.data === "OK") {
                    props.setChanged(true);
                }
            })
            .catch(err => {
                setSubmitting(false);
                if (err.response.status === 400) {
                    setErrors({ general: err.response.data.error });
                }
            });
    }
})(InnerForm);

export default ChangePasswordForm;
