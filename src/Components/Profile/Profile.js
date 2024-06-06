import React, { useState } from "react";
import { Col, Row, Button, Modal, Form, Input, Card, List, Result } from "antd";
import { UserOutlined } from "@ant-design/icons";
const Profile = ({ user, setUser, paymentsByClient }) => {
  const formattedDate = new Date(user.birthday).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [balance, setBalance] = useState(user.clientBalance);

  console.log("paymentsByClient");
  console.log(paymentsByClient);
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
              <Card
                style={{
                  textAlign: "center",
                  marginTop: "5%",
                  height: "300px",
                  margin: "8px",
                }}
              >
                <div>
                  <UserOutlined style={{ fontSize: "200px" }} />
                  <br />
                  <h1>Вы: {user.userRole}</h1>
                </div>
              </Card>
            </Col>

            <Col span={12} style={{ fontSize: "large" }}>
              <Card style={{ marginTop: "5%", height: "300px", margin: "8px" }}>
                <div>
                  <h1>Данные пользователя</h1>
                  <div className="ant-space-item">
                    {" "}
                    Никнейм: {user.userName}{" "}
                  </div>
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
              </Card>
            </Col>
            {user.userRole != "admin" && user.userRole != "coach" ? (
              <Col span={24}>
                <Card
                  title={"Купленные абонементы:"}
                  bordered={false}
                  style={{ margin: "8px" }}
                >
                  <List
                    dataSource={paymentsByClient}
                    renderItem={(item) => (
                      <List.Item>
                        <Card
                          style={{
                            width: "100%",
                            marginTop: "12px",
                            padding: "12px",
                            borderRadius: "8px",
                            boxShadow:
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            backgroundColor: item.isValid
                              ? "#C0F400"
                              : "#FF9640",
                          }}
                        >
                          {item.paymentAbonement.map((abonement) => (
                            <div key={abonement.id}>
                              <h2>{abonement.abonement?.name}</h2>
                              <div>
                                Дата начала:{" "}
                                {new Date(item.dateStart).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                              <div>
                                Дата окончания:{" "}
                                {new Date(item.dateEnd).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                              <div>
                                Осталось тренировок: {item.countRemainTraining}
                              </div>
                              <div>
                                Тип услуги: {abonement.abonement?.typeService}
                              </div>
                              <div
                                style={{
                                  position: "absolute",
                                  top: "12px",
                                  right: "12px",
                                }}
                              >
                                {item.isValid
                                  ? "Действителен"
                                  : "Недействителен"}
                              </div>
                            </div>
                          ))}
                        </Card>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            ) : (
              ""
            )}
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
        <Result
          status="403"
          title="Гость"
          subTitle="Для отображения данной страницы необходима авторизация!"
        />
      )}
    </React.Fragment>
  );
};
export default Profile;
