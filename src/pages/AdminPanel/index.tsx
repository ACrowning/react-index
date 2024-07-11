import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message } from "antd";
import { products } from "../../api/products";
import styles from "./panel.module.css";

interface Product {
  id: string;
  title: string;
  amount: number;
  price: number;
  favorite: boolean;
  image?: string | null;
  albumPhotos?: string[];
}

const AdminPanel: React.FC = () => {
  const [product, setProducts] = useState<Product[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await products.getAllProducts();
      if (error) {
        message.error("Error fetching products");
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async () => {
    setIsModalVisible(false);
    const deletePromises = selectedRowKeys.map((id) =>
      products.deleteProduct(id as string)
    );
    await Promise.all(deletePromises);

    const { data, error } = await products.getAllProducts();
    if (error) {
      message.error("Error fetching products");
    } else {
      setProducts(data);
      setSelectedRowKeys([]);
      message.success("Products deleted successfully");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) =>
      setSelectedRowKeys(selectedRowKeys),
  };

  return (
    <div className={styles.adminPanel}>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={product}
        rowKey="id"
        rowClassName={(record: Product) =>
          record.amount === 0 ? styles.outOfStock : ""
        }
      />
      {selectedRowKeys.length > 0 && (
        <Button type="primary" danger onClick={() => setIsModalVisible(true)}>
          Delete Selected
        </Button>
      )}
      <Modal
        title="Confirm Deletion"
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete the selected products?</p>
      </Modal>
    </div>
  );
};

export default AdminPanel;
