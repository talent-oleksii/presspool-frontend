import * as yup from "yup";

export const creatorLoginSchema = yup.object().shape({
  email: yup.string().required("Select a card").email("Invalid email"),
  password: yup.string().required(),
});
