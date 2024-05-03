import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form } from "antd";

const Register = ({ user, setUser }) => {
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();

  const Register = async (formValues) => {
    console.log("Success:", formValues);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: formValues.nickname,
        fio: formValues.fio,
        birthday: formValues.birthday,
        email: formValues.email,
        phoneNumber: formValues.phoneNumber,
        password: formValues.password,
        passwordConfirm: formValues.passwordConfirm,
      }),
    };
    return await fetch("api/account/register", requestOptions)
      .then((response) => {
        // console.log(response.status)
        response.status === 200 &&
          setUser({
            isAuthenticated: true,
            userName: formValues.email,
            fio: formValues.fio,
            birthday: formValues.birthday,
            email: formValues.email,
            phoneNumber: formValues.phoneNumber,
            password: formValues.password,
          });
        return response.json();
      })
      .then(
        (data) => {
          if (
            typeof data !== "undefined" &&
            typeof data.userName !== "undefined"
          ) {
            console.log("Пользователь: ", user);
            setUser({
              isAuthenticated: true,
              id: data.id,
              userName: data.userName,
              userRole: data.userRole,
              fio: data.fio,
              birthday: data.birthday,
              phonenumber: data.phonenumber,
              email: data.email,
              clientBalance: data.clientBalance,
            });
            navigate("/");
          }
          typeof data !== "undefined" &&
            typeof data.error !== "undefined" &&
            setErrorMessages(data.error);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const renderErrorMessage = () =>
    errorMessages.map((error, index) => <div key={index}>{error}</div>);

  return (
    <>
      {user.isAuthenticated ? (
        <h3>Пользователь {user.userName} успешно зарегистрирован!</h3>
      ) : (
        <>
          <h3>Регистрация</h3>
          <Form
            onFinish={Register}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinishFailed={renderErrorMessage}
            autoComplete="off"
          >
            <Form.Item
              label="Никнейм: "
              name="nickname"
              rules={[
                { required: true, message: "Пожалуйста, введите никнейм!" },
              ]}
            >
              <Input placeholder="Например: UserISPU" />
            </Form.Item>

            <Form.Item
              label="ФИО: "
              name="fio"
              rules={[
                { required: true, message: "Пожалуйста, введите ваше ФИО!" },
              ]}
            >
              <Input placeholder="Например: Иванов Иван Иванович" />
            </Form.Item>
            <Form.Item
              label="Дата рождения: "
              name="birthday"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите дату рождения!",
                },
              ]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              label="Почта: "
              name="email"
              rules={[
                { required: true, message: "Пожалуйста, введите почту!" },
              ]}
            >
              <Input placeholder="Например: user@mail.com" />
            </Form.Item>
            <Form.Item
              label="Номер телефона: "
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите номер телефона!",
                },
              ]}
            >
              <Input placeholder="Например: 89123456789" />
            </Form.Item>

            <Form.Item
              label="Пароль: "
              name="password"
              rules={[
                { required: true, message: "Пожалуйста, введите пароль!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Подтверждение пароля: "
              name="passwordConfirm"
              rules={[
                { required: true, message: "Пожалуйста, подтвердите пароль!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {" "}
                Зарегистрироваться{" "}
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
};
export default Register;
