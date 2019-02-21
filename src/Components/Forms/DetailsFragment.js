import React from "react";
import Input from "../Controls/Input";

function DetailsFragment({
    values,
    handleChange,
    touched,
    errors,
    handleBlur
}) {
    return (
        <React.Fragment>
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
        </React.Fragment>
    );
}

export default DetailsFragment;
