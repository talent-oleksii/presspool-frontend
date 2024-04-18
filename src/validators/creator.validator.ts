import * as yup from "yup";

export const creatorLoginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Enter email address")
    .email("Invalid email address"),
  password: yup.string().required("Enter password"),
});

export const creatorSignupSchema = yup.object().shape({
  fullName: yup.string().required("Enter fullName"),
  newsletter: yup.string().required("Enter Publication / Newsletter Name"),
  email: yup
    .string()
    .required("Enter email address")
    .email("Invalid email address"),
  password: yup.string().required("Enter password"),
  agreeTerm: yup
    .boolean()
    .test(
      "is-true",
      "Must accept terms of service and privacy policy",
      (value) => value === true
    )
    .required(),
});
