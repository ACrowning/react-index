import * as Yup from "yup";

const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  price: Yup.number().positive("Price must be positive"),
  image: Yup.mixed()
    .required("Main image is required")
    .test("fileFormat", "Unsupported Format", (value) => {
      if (value) {
        return ["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(
          value.type
        );
      }
      return true;
    }),
  albumPhotos: Yup.array().of(
    Yup.mixed()
      .nullable()
      .test("fileFormat", "Unsupported Format", (value) => {
        if (value) {
          return ["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(
            value.type
          );
        }
        return true;
      })
  ),
});

export default schema;
