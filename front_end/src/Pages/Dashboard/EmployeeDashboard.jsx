import React from "react";
import { Card, Row, Col, Avatar, Tag, Button } from "antd";
import { UserOutlined, KeyOutlined, CheckCircleOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="container" style={{ maxWidth: "1000px" }}>
        <Card
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "#fff",
            marginBottom: "24px"
          }}
          bordered={false}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: "#10b981" }} />
                <div>
                  <h2 style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
                    Welcome, {user.full_name || "User"}!
                  </h2>
                  <p style={{ color: "#94a3b8", margin: "4px 0 0 0" }}>
                    Logged in as User Account
                  </p>
                </div>
              </div>
            </Col>
            <Col>
              <Tag color="green" style={{ padding: "4px 12px", fontSize: "14px", borderRadius: "20px" }}>
                Active Session
              </Tag>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card
              title="Account Details"
              bordered={false}
              style={{ borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
            >
              <p><strong>Full Name:</strong> {user.full_name || "N/A"}</p>
              <p><strong>Email:</strong> {user.email || "N/A"}</p>
              <p><strong>User Role:</strong> {user.user_type || "employee"}</p>
              <Button
                type="primary"
                onClick={() => navigate("/employee/profile")}
                style={{ marginTop: "8px" }}
              >
                View / Edit Profile
              </Button>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title="Quick Security Settings"
              bordered={false}
              style={{ borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
            >
              <p style={{ color: "#64748b" }}>
                Manage your account credentials and update your password anytime.
              </p>
              <Button
                icon={<KeyOutlined />}
                onClick={() => navigate("/employee/change-password")}
                style={{ marginTop: "8px" }}
              >
                Change Password
              </Button>
            </Card>
          </Col>
        </Row>
    </div>
  );
};

export default EmployeeDashboard;