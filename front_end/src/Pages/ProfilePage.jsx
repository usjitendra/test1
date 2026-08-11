import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Card, Avatar, Form, Input, message } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const token = localStorage.getItem("accessToken") || "";
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(stored);
    form.setFieldsValue({
      full_name: stored.full_name || stored.username || "",
      email: stored.email || "",
      user_type: stored.user_type || "",
      department: stored.department || "",
      phone: stored.phone || "",
    });
  }, [form]);

  const handleEditToggle = () => {
    setEditing((s) => !s);
  };

  const onFinish = async (values) => {
    try {
      const updated = {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        department: values.department,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/update`,
        updated,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const newUserObj = { ...user, ...res.data.data };
        setUser(newUserObj);
        localStorage.setItem("user", JSON.stringify(newUserObj));
        message.success("Profile updated successfully");
        setEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const initials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="dashboard-container">
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12} lg={8}>
              <Card className="form-card profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <Avatar size={96} style={{ backgroundColor: "#87d068" }}>
                      {initials(user.full_name || user.username)}
                    </Avatar>
                  </div>

                  <div className="profile-actions">
                    <h2 className="profile-name">
                      {user.full_name || user.username}
                    </h2>
                    <div className="profile-meta">{user.email}</div>
                    <div style={{ marginTop: 52, gap: 10 }}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleEditToggle}
                      >
                        <EditOutlined /> {editing ? "Cancel" : "Edit Profile"}
                      </Button>{" "}
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => {
                          if (user.user_type === "employee") {
                            navigate("/employee/change-password");
                          } else {
                            navigate("/admin/change-password");
                          }
                        }}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                  >
                    <Row>
                      <Col xs={12} md={6}>
                        <Form.Item
                          label="Full Name"
                          name="full_name"
                          rules={[
                            {
                              required: true,
                              message: "Please enter full name",
                            },
                          ]}
                        >
                          <Input disabled={!editing} />
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Item
                          label="Email"
                          name="email"
                          rules={[{ required: true }]}
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12} md={6}>
                        <Form.Item label="Role" name="user_type">
                          <Input disabled />
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Item label="Department" name="department">
                          <Input disabled={!editing} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12} md={6}>
                        <Form.Item label="Phone" name="phone">
                          <Input disabled={!editing} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <div style={{ marginTop: 12 }}>
                      {editing && (
                        <Button
                          variant="success"
                          type="button"
                          onClick={() => form.submit()}
                        >
                          <SaveOutlined /> Save Changes
                        </Button>
                      )}
                    </div>
                  </Form>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
  );
};

export default ProfilePage;
