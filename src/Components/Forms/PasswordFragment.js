import React from "react";
import Input from "../Controls/Input";
import { VisibilityIcon } from "../Icons/Icons";

function PasswordFragment({
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    status,
    setStatus
}) {
    return (
        <React.Fragment>
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
                    touched.passwordConfirmation && errors.passwordConfirmation
                }
                errorMessage={errors.passwordConfirmation}
                onBlur={handleBlur}
                correct={
                    touched.passwordConfirmation && !errors.passwordConfirmation
                }
            >
                <VisibilityIcon
                    visiblePassword={status.visibleConfirmation}
                    setVisiblePassword={value =>
                        setStatus({ ...status, visibleConfirmation: value })
                    }
                />
            </Input>
        </React.Fragment>
    );
}

export default PasswordFragment;
