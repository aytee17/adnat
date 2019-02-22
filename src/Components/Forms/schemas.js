import { string } from "yup";

export const detailsSchema = {
    name: string().required("Name is required"),
    email: string()
        .email("Incorrect email structure")
        .required("An email is required")
};

export const passwordSchema = {
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
};
