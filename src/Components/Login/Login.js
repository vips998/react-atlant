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
        rememberMe: formValues.remember,
      }),
    };
    return await fetch("api/account/login", requestOptions)
      .then((response) => {
        return response
          .json()
          .then((data) => ({ status: response.status, body: data }));
      })
      .then(({ status, body }) => {
        console.log(body);
        if (status === 200) {
          localStorage.setItem("jwt", body.token); // Сохраняем JWT в localStorage
          setUser({
            isAuthenticated: true,
            id: body.id,
            userName: body.userName,
            userRole: body.userRole,
            fio: body.fio,
            birthday: body.birthday,
            phonenumber: body.phonenumber,
            email: body.email,
            clientBalance: body.clientBalance,
          });
          navigate("/");
        } else if (body.error) {
          setErrorMessages(body.error);
        }
      })
      .catch((error) => {
        console.error("Ошибка входа:", error);
        setErrorMessages(["Ошибка сервера. Попробуйте позже."]);
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
