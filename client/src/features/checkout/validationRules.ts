import * as yup from "yup";

export const addressSchema = yup.object({
  firstName: yup.string().trim().max(59).required("First name is required"),
  lastName: yup.string().trim().max(60).required("Last name is required"),
  address1: yup.string().trim().max(200).required("Address is required"),
  address2: yup.string().trim().max(200).default(""),
  city: yup.string().trim().max(100).required("City is required"),
  state: yup.string().trim().max(100).required("Province is required"),
  zip: yup.string().trim().max(20).required("Postal code is required"),
  country: yup.string().trim().max(100).required("Country is required"),
});

export type AddressFields = yup.InferType<typeof addressSchema>;
