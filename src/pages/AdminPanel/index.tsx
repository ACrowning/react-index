import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message } from "antd";
import { products as p } from "../../api/products";
import styles from "./panel.module.css";
import withAdminAccess from "../../hoc/withAdminAccess";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (page: number, limit: number) => {
    setLoading(true);
    const { data, error } = await p.getProducts({
      title: "",
      sortByPrice: "",
      page,
      limit,
    });
    setLoading(false);

    if (error) {
      console.error("Error fetching products", data);
    } else {
      if (data && Array.isArray(data.products)) {
        setProducts(data.products as Product[]);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: limit,
          total: data.total || 0,
        }));
      } else {
        console.error("Products data format is not valid:", data);
        setProducts([]);
      }
    }
  };

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleDelete = async () => {
    setIsModalVisible(false);
    const deletePromises = selectedRowKeys.map((id) =>
      p.deleteProduct(id as string)
    );
    await Promise.all(deletePromises);

    fetchProducts(pagination.current, pagination.pageSize);
    setSelectedRowKeys([]);
    message.success("Products deleted successfully");
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
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
        dataSource={products}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
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

export default withAdminAccess(AdminPanel);
