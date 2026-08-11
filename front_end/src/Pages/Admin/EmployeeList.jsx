import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, Button, Tag, Space, Switch } from "antd";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import { Modal, Form, Button as Btn, Spinner, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    user_type: "employee",
    password: "",
  });

  const [alert, setAlert] = useState(null);
  const token = localStorage.getItem("accessToken");

  const getUserList = useCallback(
    async (page = 1, limit = 10, search = "") => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/get-all`,
          {
            params: { page, limit, search },
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setUsers(res.data.data.users);
          setPagination({
            current: res.data.data.pagination.page,
            pageSize: res.data.data.pagination.limit,
            total: res.data.data.total_users,
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    getUserList();
  }, [getUserList]);

  const handleTableChange = (newPagination) => {
    getUserList(newPagination.current, newPagination.pageSize, searchText);
  };

  const onSearch = (value) => {
    setSearchText(value);
    getUserList(1, pagination.pageSize, value);
  };

  const hideAlert = () => setAlert(null);

  const showSuccessAlert = (message) => {
    setAlert(
      <SweetAlert
        success
        title="Success"
        onConfirm={() => {
          hideAlert();
          getUserList(pagination.current, pagination.pageSize, searchText);
        }}
        timeout={2000}
      >
        {message}
      </SweetAlert>
    );
  };

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        full_name: employee.full_name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        user_type: employee.user_type || "employee",
        password: "",
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        user_type: "employee",
        password: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.full_name || !formData.email || (!editingEmployee && !formData.password)) {
      alert("Please fill in all required fields (Full name, email, and password)");
      return;
    }

    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { ...formData };

      if (editingEmployee) {
        await axios.put(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/edit/${editingEmployee._id}`,
          payload,
          config
        );
        showSuccessAlert("User Updated Successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL}/user/add`,
          payload,
          config
        );
        showSuccessAlert("User Added Successfully!");
      }
      setShowModal(false);
    } catch (error) {
      console.error(error);
      setAlert(
        <SweetAlert danger title="Error" onConfirm={hideAlert}>
          {error.response?.data?.message || "Something went wrong!"}
        </SweetAlert>
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (checked, record) => {
    let res = await axios.patch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/user/toggle-status/${record._id}`,
      { is_active: checked },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.success) {
      showSuccessAlert("Status Updated Successfully");
      getUserList(pagination.current, pagination.pageSize, searchText);
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Role",
      dataIndex: "user_type",
      key: "user_type",
      render: (role) =>
        role === "super_admin" ? (
          <Tag color="purple">Super Admin</Tag>
        ) : role === "admin" ? (
          <Tag color="gold">Admin</Tag>
        ) : (
          <Tag color="cyan">Employee</Tag>
        ),
    },
    {
      title: "Status",
      key: "is_active",
      dataIndex: "is_active",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleStatusChange(checked, record)}
          loading={loading}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      {alert}
      <div className="dashboard-content">
        <div
          className="dashboard-header-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2 className="dashboard-title">User & Employee Management</h2>
          <Btn
            style={{
              color: "black",
              backgroundColor: "#00AEEF",
              border: "none",
            }}
            onClick={() => handleOpenModal()}
          >
            Add User
          </Btn>
        </div>

        <div className="table-container">
          <div className="filter-container" style={{ marginBottom: "16px" }}>
            <Input
              placeholder="Search by name or email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => onSearch(e.target.value)}
              className="search-input"
              style={{ maxWidth: 400 }}
              allowClear
            />
          </div>

          <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} users`,
            }}
            onChange={handleTableChange}
          />
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        backdrop={isSubmitting ? "static" : true}
      >
        <Modal.Header
          closeButton={!isSubmitting}
          style={{ backgroundColor: "#090909", color: "white" }}
        >
          <Modal.Title>
            {editingEmployee ? "Edit User" : "Add New User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>
                    Full Name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    disabled={isSubmitting}
                    name="full_name"
                    placeholder="Enter full name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>
                    Email <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    disabled={isSubmitting}
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    disabled={isSubmitting}
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>
                    User Role <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    disabled={isSubmitting}
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleInputChange}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>
                    Password {!editingEmployee && <span style={{ color: "red" }}>*</span>}
                  </Form.Label>
                  <Form.Control
                    disabled={isSubmitting}
                    type="password"
                    name="password"
                    placeholder={
                      editingEmployee
                        ? "Leave blank to keep current password"
                        : "Enter password"
                    }
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Btn
            variant="secondary"
            onClick={handleCloseModal}
            disabled={isSubmitting}
          >
            Cancel
          </Btn>
          <Btn
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              minWidth: "100px",
              backgroundColor: "#00AEEF",
              border: "none",
            }}
          >
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" /> Saving...
              </>
            ) : editingEmployee ? (
              "Update"
            ) : (
              "Save"
            )}
          </Btn>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeList;
