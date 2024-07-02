import React, { useState, useContext } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Avatar,
  Dropdown,
  Menu,
  Select,
} from "antd";
import { AuthContext } from "../../../context/AuthContext";
import { users, Role } from "../../../api/users";

const { Option } = Select;

const Login: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  const { user, setUser } = context;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleRegister = async (values: any) => {
    try {
      const response = await users.registerUser(values);
      const { user, token } = response;
      setUser({ username: user.username, token });
      setIsModalVisible(false);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const menuItems = [
    {
      key: "logout",
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const menu = <Menu items={menuItems} />;

  return (
    <div style={{ padding: "20px", textAlign: "right" }}>
      {user ? (
        <Dropdown overlay={menu} placement="bottomRight">
          <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
        </Dropdown>
      ) : (
        <Button type="primary" onClick={showModal}>
          Login
        </Button>
      )}
      <Modal
        title="Register"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={handleRegister}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
                type: "email",
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="role"
            rules={[{ required: true, message: "Please select your role!" }]}
          >
            <Select placeholder="Select a role">
              <Option value={Role.GUEST}>{Role.GUEST}</Option>
              <Option value={Role.ADMIN}>{Role.ADMIN}</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
