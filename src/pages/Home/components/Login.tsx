import { useState } from "react";
import { Button, Modal, Form, Input, Avatar, Dropdown, Menu } from "antd";
import { UserProvider, useUser } from "./UserContext";
import { users } from "../../../api/users";

const Login: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { user, setUser } = useUser();

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

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

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
            <Input placeholder="Role" />
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

const Main: React.FC = () => (
  <UserProvider>
    <Login />
  </UserProvider>
);

export default Main;
