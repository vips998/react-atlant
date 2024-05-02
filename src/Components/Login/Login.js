import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input } from "antd";

const LogIn = ({ user, setUser }) => {
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();

  const logIn = async (formValues) => {
    console.log("Success:", formValues);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formValues.email,
        password: formValues.password,
        rememberme: formValues.remember,
      }),
    };
    return await fetch("api/account/login", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data:", data);
        if (data) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              isAuthenticated: true,
              userName: data.userName,
              userRole: data.userRole,
            })
          );
          setUser({
            isAuthenticated: true,
            userName: data.userName,
            userRole: data.userRole,
            clientBalance: data.clientBalance,
          });
          navigate("/");
        } else {
          setErrorMessages(data.error || ["Authentication failed"]);
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setErrorMessages(["Network error or server is down"]);
      });
  };
  const renderErrorMessage = () =>
    errorMessages.map((error, index) => <div key={index}>{error}</div>);
  return (
    <>
      {user.isAuthenticated ? (
        <h3>Пользователь {user.userName} успешно вошел в систему</h3>
      ) : (
        <>
          <h3>Вход</h3>
          <Form
            onFinish={logIn}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinishFailed={renderErrorMessage}
            autoComplete="off"
          >
            <Form.Item
              label="Почта"
              name="email"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Пароль"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Запомнить меня</Checkbox>
              {renderErrorMessage()}
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
};
export default LogIn;
