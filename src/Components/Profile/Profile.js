import React, { useState } from "react";
import { Col, Row, Button, Modal, Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
const Profile = ({ user, setUser }) => {
  const formattedDate = new Date(user.birthday).toLocaleDateString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [balance, setBalance] = useState(user.clientBalance);

  const updateBalance = async () => {
    const newBalance = user.clientBalance + parseFloat(balance);

    setUser((prevUser) => ({
      ...prevUser,
      clientBalance: newBalance,
    }));

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ NewBalance: newBalance }),
    };

    await fetch(`/api/Users/${user.id}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); // Изменено на text(), так как ожидается пустой ответ
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    updateBalance();
    // тут логика увеличения баланса на указанную сумму
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <React.Fragment>
      {user.isAuthenticated ? (
        <>
          <Row>
            <Col span={12} style={{ fontSize: "large" }}>
              <div style={{ textAlign: "center", marginTop: "5%" }}>
                <UserOutlined style={{ fontSize: "200px" }} />
                <br />
                <h1>Вы: {user.userRole}</h1>
              </div>
            </Col>

            <Col span={12} style={{ fontSize: "large", marginTop: "2%" }}>
              <div>
                <h1>Данные пользователя</h1>
                <div className="ant-space-item"> Никнейм: {user.userName} </div>
                <div className="ant-space-item"> ФИО: {user.fio} </div>
                <div className="ant-space-item">
                  {" "}
                  Дата рождения: {formattedDate}{" "}
                </div>
                <div className="ant-space-item"> Почта: {user.email} </div>
                <div className="ant-space-item">
                  {" "}
                  Телефон: {user.phonenumber}{" "}
                </div>
                {user.userRole != "admin" && user.userRole != "coach" ? (
                  <>
                    <div className="ant-space-item">
                      {" "}
                      Баланс: {user.clientBalance}
                      {" рублей"}
                    </div>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={showModal}
                    >
                      Пополнить баланс
                    </Button>
                  </>
                ) : (
                  ""
                )}
              </div>
            </Col>
          </Row>
          <Modal
            title="Пополнение баланса"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form layout="vertical">
              <Form.Item label="Сумма пополнения">
                <Input onChange={(e) => setBalance(e.target.value)} />
              </Form.Item>
            </Form>
          </Modal>
        </>
      ) : (
        "Для отображения данной страницы необходима авторизация!"
      )}
    </React.Fragment>
  );
};
export default Profile;
