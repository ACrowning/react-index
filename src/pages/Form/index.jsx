import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from "../Form/form.module.css";
import { products } from "../../api/products.js";
import schema from "../Form/schema.js";
import { useNavigate } from "react-router-dom";
import { Alert } from "antd";

const ProductForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    amount: "",
    price: "",
    favorite: false,
    image: null,
    albumPhotos: [],
  };

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
      resetForm();
      setMessage({ type: "success", content: "Product added successfully!" });
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } else {
      setErrorMessage("Failed to create product: " + error);
    }

    setSubmitting(false);
  };

  return (
    <div>
      <h1>Add New Product</h1>
      <div className={styles.alert}>
        {message.content && (
          <Alert
            message={message.content}
            type={message.type}
            showIcon
            className={styles.alert}
          />
        )}
        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            className={styles.alert}
          />
        )}
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <div className={styles.formStyle}>
              <label htmlFor="title">Title:</label>
              <Field type="text" id="title" name="title" />
              <ErrorMessage
                className={styles.error}
                name="title"
                component="div"
              />
            </div>
            <div className={styles.formStyle}>
              <label htmlFor="amount">Amount:</label>
              <Field type="number" id="amount" name="amount" />
              <ErrorMessage
                className={styles.error}
                name="amount"
                component="div"
              />
            </div>
            <div className={styles.formStyle}>
              <label htmlFor="price">Price:</label>
              <Field type="number" step="0.01" id="price" name="price" />
              <ErrorMessage
                className={styles.error}
                name="price"
                component="div"
              />
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
              <ErrorMessage
                className={styles.error}
                name="image"
                component="div"
              />
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
