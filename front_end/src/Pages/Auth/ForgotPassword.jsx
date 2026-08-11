import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('resetEmail', values.username);
      message.success('Password reset link sent! Redirecting...');
      setTimeout(() => {
        navigate('/reset-password');
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
                <h2>Forgot Password</h2>
                <p>Enter your username to reset password</p>
              </div>
              <Form
                name="forgot-password"
                onFinish={onFinish}
                layout="vertical"
                className="auth-form"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: 'Please enter your username!' }]}
                >
                  <Input size="large" placeholder="Enter your username" />
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
                    Send Reset Link
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

export default ForgotPassword;
