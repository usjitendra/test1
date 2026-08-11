import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spin } from "antd";
import { TeamOutlined, CrownOutlined } from "@ant-design/icons";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_employees: 0, total_admins: 0 });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/user/get-all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setStats({
            total_employees: res.data.data.total_employees || 0,
            total_admins: res.data.data.total_admins || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div className="container" style={{ maxWidth: "1100px" }}>
      <h2 style={{ marginBottom: "20px", fontWeight: 700, color: "#0f172a" }}>Dashboard</h2>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              background: "#ffffff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  background: "#e0f2fe",
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TeamOutlined style={{ fontSize: "30px", color: "#00AEEF" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#64748b", margin: 0, fontSize: "14px", fontWeight: 500 }}>
                  Total Employees
                </p>
                {loading ? (
                  <Spin size="small" style={{ marginTop: "4px" }} />
                ) : (
                  <h2 style={{ margin: "4px 0 0 0", fontSize: "28px", fontWeight: 700, color: "#0f172a" }}>
                    {stats.total_employees}
                  </h2>
                )}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              background: "#ffffff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  background: "#f3e8ff",
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CrownOutlined style={{ fontSize: "30px", color: "#8b5cf6" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#64748b", margin: 0, fontSize: "14px", fontWeight: 500 }}>
                  Total Admins
                </p>
                {loading ? (
                  <Spin size="small" style={{ marginTop: "4px" }} />
                ) : (
                  <h2 style={{ margin: "4px 0 0 0", fontSize: "28px", fontWeight: 700, color: "#0f172a" }}>
                    {stats.total_admins}
                  </h2>
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
