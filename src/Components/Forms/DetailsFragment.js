import React from "react";
import Input from "../Controls/Input";

function DetailsFragment({
    values,
    handleChange,
    touched,
    errors,
    handleBlur,
    showCorrect
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
                correct={showCorrect ? touched.name && !errors.name : false}
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
                correct={showCorrect ? touched.email && !errors.email : false}
            />
        </React.Fragment>
    );
}

export default DetailsFragment;
