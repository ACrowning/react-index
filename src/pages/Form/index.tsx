import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from "../Form/form.module.css";
import { products } from "../../api/products";
import schema from "./schema";
import { useNavigate } from "react-router-dom";
import { notification, Button, Input } from "antd";

const ProductForm = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [albumPhotoPreviews, setAlbumPhotoPreviews] = useState<string[]>([]);
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    amount: "",
    price: "",
    favorite: false,
    image: null,
    albumPhotos: [],
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("amount", values.amount);
    formData.append("price", values.price);
    formData.append("favorite", values.favorite.toString());

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
      notification.success({
        message: "Success",
        description: "Product added successfully!",
      });

      navigate("/");
    } else {
      notification.error({
        message: "Error",
        description: "Failed to create product: " + error,
      });
    }

    setSubmitting(false);
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue("image", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAlbumPhotosChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const files = Array.from(event.currentTarget.files || []);
    setFieldValue("albumPhotos", files);

    const previews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        setAlbumPhotoPreviews([...previews]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className={styles.formContainer}>
      <h2>Add New Product</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.formItem}>
              <label htmlFor="title">Title:</label>
              <Field as={Input} type="text" id="title" name="title" />
              <ErrorMessage
                className={styles.error}
                name="title"
                component="div"
              />
            </div>
            <div className={styles.formItem}>
              <label htmlFor="amount">Amount:</label>
              <Field as={Input} type="number" id="amount" name="amount" />
              <ErrorMessage
                className={styles.error}
                name="amount"
                component="div"
              />
            </div>
            <div className={styles.formItem}>
              <label htmlFor="price">Price:</label>
              <Field
                as={Input}
                type="number"
                step="0.01"
                id="price"
                name="price"
              />
              <ErrorMessage
                className={styles.error}
                name="price"
                component="div"
              />
            </div>

            <div className={styles.formItem}>
              <label htmlFor="image">Main Image:</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={(event) => handleImageChange(event, setFieldValue)}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className={styles.imagePreview}
                />
              )}
              <ErrorMessage
                className={styles.error}
                name="image"
                component="div"
              />
            </div>
            <div className={styles.formItem}>
              <label htmlFor="albumPhotos">Album Photos:</label>
              <input
                type="file"
                id="albumPhotos"
                name="albumPhotos"
                accept="image/*"
                multiple
                onChange={(event) =>
                  handleAlbumPhotosChange(event, setFieldValue)
                }
              />
              <div className={styles.imagePreviews}>
                {albumPhotoPreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Album preview ${index + 1}`}
                    className={styles.imagePreview}
                  />
                ))}
              </div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductForm;
