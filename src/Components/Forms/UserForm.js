import React from "react";
import style from "./UserForm.scss";
import { object } from "yup";
import { detailsSchema } from "./schemas";
import { withFormik } from "formik";
import { api } from "../../utils/api";
import DetailsFragment from "./DetailsFragment";
import Button from "../Controls/Button";

function InnerForm({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setEditing
}) {
    return (
        <form onSubmit={handleSubmit}>
            <div className={style["container"]}>
                <DetailsFragment
                    values={values}
                    handleChange={handleChange}
                    touched={touched}
                    errors={errors}
                    handleBlur={handleBlur}
                    showCorrect={false}
                />
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    formNoValidate={true}
                >
                    Save
                </Button>
                <Button onClick={() => setEditing(false)}>Cancel</Button>
            </div>
        </form>
    );
}

const UserForm = withFormik({
    mapPropsToValues: ({ user }) => {
        const { name, email } = user;
        return {
            name,
            email
        };
    },
    validationSchema: object().shape(detailsSchema),
    handleSubmit: (values, { props }) => {
        api.put("/users/me", {
            name: values.name.trim(),
            email: values.email.trim()
        }).then(response => {
            console.log(response);
            props.updateUser(response.data);
            props.setEditing(false);
        });
    }
})(InnerForm);

export default UserForm;
