import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "../Form/form.module.css";
import { products } from "../../api/products.js";

const ProductForm = () => {
  const initialValues = {
    title: "",
    amount: "",
    price: "",
    favorite: false,
    image: null,
    albumPhotos: [],
  };

  const validationSchema = Yup.object({
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
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("amount", values.amount);
    formData.append("price", values.price);
    formData.append("favorite", values.favorite);

    if (values.image) {
      formData.append("image", values.image);
    }

    if (values.albumPhotos && values.albumPhotos.length > 0) {
      for (let i = 0; i < values.albumPhotos.length; i++) {
        formData.append("albumPhotos", values.albumPhotos[i]);
      }
    }

    const { data, error } = await products.addProduct(formData);
    if (data) {
      alert("Product created successfully!");
      resetForm();
    } else {
      alert("Failed to create product: " + error);
    }

    setSubmitting(false);
  };

  return (
    <div>
      <h1>Upload Product</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <div className={styles.formStyle}>
              <label htmlFor="title">Title:</label>
              <Field type="text" id="title" name="title" />
              <ErrorMessage name="title" component="div" />
            </div>
            <div className={styles.formStyle}>
              <label htmlFor="amount">Amount:</label>
              <Field type="number" id="amount" name="amount" />
              <ErrorMessage name="amount" component="div" />
            </div>
            <div className={styles.formStyle}>
              <label htmlFor="price">Price:</label>
              <Field type="number" step="0.01" id="price" name="price" />
              <ErrorMessage name="price" component="div" />
            </div>
            <div className={styles.formStyle}>
              <label htmlFor="favorite">Favorite:</label>
              <Field type="checkbox" id="favorite" name="favorite" />
            </div>
            <div className={styles.formStyle}>
              <label htmlFor="image">Main Image:</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  setFieldValue("image", event.currentTarget.files[0]);
                }}
              />
              <ErrorMessage name="image" component="div" />
            </div>
            <div className={styles.formStyle}>
              <label htmlFor="albumPhotos">Album Photos:</label>
              <input
                type="file"
                id="albumPhotos"
                name="albumPhotos"
                accept="image/*"
                multiple
                onChange={(event) => {
                  setFieldValue(
                    "albumPhotos",
                    Array.from(event.currentTarget.files)
                  );
                }}
              />
            </div>
            <button
              className={styles.buttons}
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductForm;
