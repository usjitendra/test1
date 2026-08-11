import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem('resetEmail');
      message.success('Password reset successful! Please login with your new password.');
      setTimeout(() => {
        navigate('/');
      }, 1000);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-container">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={5}>
            <div className="auth-card">
              <div className="auth-header">
                <h2>Reset Password</h2>
                <p>Enter your new password</p>
              </div>
              <Form
                name="reset-password"
                onFinish={onFinish}
                layout="vertical"
                className="auth-form"
              >
                <Form.Item
                  label="New Password"
                  name="password"
                  rules={[
                    { required: true, message: 'Please enter your new password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                  ]}
                >
                  <Input.Password size="large" placeholder="Enter new password" />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                  ]}
                >
                  <Input.Password size="large" placeholder="Confirm new password" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    className="auth-button"
                    block
                  >
                    Reset Password
                  </Button>
                </Form.Item>

                <Form.Item>
                  <Link to="/" className="back-link">
                    Back to Login
                  </Link>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword;
