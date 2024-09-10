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
  notification,
} from "antd";
import { AuthContext } from "../../../context/AuthContext";
import { users, UserRegisterPayload } from "../../../api/users";
import { Role } from "../../../constants";

const { Option } = Select;

const AuthModal: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [formType, setFormType] = useState<"login" | "register">("login");
  const [form] = Form.useForm();

  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext must be used within a AuthProvider");
  }
  const { user, setUser } = context;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleRegister = async (values: UserRegisterPayload) => {
    try {
      const { user, token } = await users.registerUser(values);
      setUser({ ...user, token });
      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
      });
      console.error("Registration failed:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const { user, token } = await users.loginUser(
        values.email,
        values.password
      );

      setUser({ ...user, token });

      notification.success({
        message: "Login Successful",
        description: "You have logged in successfully!",
      });
      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
      console.error("Login failed:", error);
    }
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
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
        </Dropdown>
      ) : (
        <Button type="primary" onClick={showModal}>
          Login
        </Button>
      )}
      <Modal
        title={formType === "login" ? "Login" : "Register"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={formType === "login" ? handleLogin : handleRegister}
        >
          {formType === "register" && (
            <>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="role"
                rules={[
                  { required: true, message: "Please select your role!" },
                ]}
              >
                <Select placeholder="Select a role">
                  <Option value={Role.GUEST}>{Role.GUEST}</Option>
                  <Option value={Role.ADMIN}>{Role.ADMIN}</Option>
                </Select>
              </Form.Item>
            </>
          )}
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
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {formType === "login" ? "Login" : "Register"}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="link"
              onClick={() =>
                setFormType(formType === "login" ? "register" : "login")
              }
            >
              {formType === "login"
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuthModal;
