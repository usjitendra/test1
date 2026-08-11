import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const loginTime = Date.now();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const loginRes = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/user/login`, values);
      const resData = loginRes?.data;

      if (resData?.success && resData?.data) {
        const { user, accessToken } = resData.data;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem("loginTime", loginTime.toString());
        message.success(resData.message || 'Login successful');
        if (user?.user_type === 'super_admin') {
          navigate('/super-admin');
        } else if (user?.user_type === 'admin') {
          navigate('/admin');
        } else {
          navigate('/employee');
        }
      } else {
        message.error(resData?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error', error);
      const errMsg = error?.response?.data?.message || 'Login failed, please try again';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (values) => {
    setLoading(true);
    setTimeout(() => {
      message.success(`Password reset link sent to ${values.email}`);
      setIsReset(false);
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  const handleResetPassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      return message.error('Passwords do not match!');
    }

    setLoading(true);
    setTimeout(() => {
      message.success('Password reset successfully!');
      setIsReset(false);
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/jamtech.png" width="300" alt="Jamtech Technologies" />
        </div>

        {isReset === 'forgot' ? (
          <Form form={form} onFinish={handleForgotPassword} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
            >
              <Input placeholder="Enter your email" disabled={loading} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-btn" block loading={loading}>
                Send Reset Link
              </Button>
            </Form.Item>
            <div className="login-links">
              <a onClick={() => !loading && setIsReset(false)}>Back to Login</a>
            </div>
          </Form>
        ) : isReset === 'reset' ? (
          <Form form={form} onFinish={handleResetPassword} layout="vertical">
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[{ required: true, message: 'Please enter new password!' }]}
            >
              <Input.Password placeholder="Enter new password" disabled={loading} />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[{ required: true, message: 'Please confirm password!' }]}
            >
              <Input.Password placeholder="Confirm password" disabled={loading} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-btn" block loading={loading}>
                Reset Password
              </Button>
            </Form.Item>
            <div className="login-links">
              <a onClick={() => !loading && setIsReset(false)}>Back to Login</a>
            </div>
          </Form>
        ) : (
          <Form form={form} onFinish={handleLogin} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please enter Email !' }]}
            >
              <Input placeholder="Enter username" disabled={loading} />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter password!' }]}
            >
              <Input.Password placeholder="Enter password" disabled={loading} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-btn" block loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;