import { string } from "yup";

export const detailsSchema = {
    name: string().required("Name is required"),
    email: string()
        .email("Incorrect email structure")
        .required("An email is required")
};

export const passwordSchema = ({ newPassword }) => ({
    password: string()
        .min(6, "Password is shorter than six characters")
        .required(`A ${newPassword ? "new" : ""} password is required`),
    passwordConfirmation: string()
        .required(`Please confirm your ${newPassword ? "new" : ""} password`)
        .when("password", (password, schema) =>
            schema.test(
                "passwords match",
                "Passwords do not match",
                passwordConfirmation => passwordConfirmation === password
            )
        )
});
