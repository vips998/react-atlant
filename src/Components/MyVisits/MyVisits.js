import React, { useState, useEffect } from "react";
import { Col, Row, Button, Card, List, Typography } from "antd";

const MyVisits = ({
  user,
  paymentsByClient,
  timeTables,
  coachs,
  users,
  visitsClient,
  setVisitsClient,
  removeVisitRegister,
}) => {
  const [validVisits, setValidVisits] = useState([]);
  const [pastPresentVisits, setPastPresentVisits] = useState([]);
  const [pastAbsentVisits, setPastAbsentVisits] = useState([]);

  useEffect(() => {
    if (visitsClient && visitsClient.length > 0) {
      const valid = visitsClient.filter(
        (visit) => visit.visitDate === false && visit.isPresent === false
      );
      const pastPresent = visitsClient.filter(
        (visit) =>
          (visit.visitDate === true || visit.visitDate === false) &&
          visit.isPresent === true
      );
      const pastAbsent = visitsClient.filter(
        (visit) => visit.visitDate === true && visit.isPresent === false
      );

      setValidVisits(valid);
      setPastPresentVisits(pastPresent);
      setPastAbsentVisits(pastAbsent);

      console.log("Проверка посещений");
      console.log(valid);
      console.log(pastPresent);
      console.log(pastAbsent);
    }
  }, [visitsClient]);

  console.log(visitsClient);
  console.log(paymentsByClient);
  console.log(timeTables);

  // функция для обновления страницы
  const windowReload = () => {
    window.location.reload(); // Обновить страницу
  };

  // Обработка удаления
  const deleteVisit = async ({ id }) => {
    console.log(id);
    const requestOptions = {
      method: "DELETE",
    };
    return await fetch(`api/VisitRegisters/${id}`, requestOptions).then(
      (response) => {
        if (response.ok) {
          removeVisitRegister(id);
          setVisitsClient(visitsClient.filter((x) => x.id !== id));
          windowReload();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };
  return (
    <React.Fragment>
      {user.isAuthenticated ? (
        <div>
          {validVisits.length > 0 && (
            <Card title="Действительные посещения">
              <List
                dataSource={validVisits}
                renderItem={(visit) => (
                  <List.Item>
                    <Card
                      style={{
                        backgroundColor: "#ADD8E6",
                        width: "100%",
                      }}
                    >
                      <Row>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Услуга
                            </Typography.Text>
                          </Typography>
                          {
                            paymentsByClient.find(
                              (type) => type.id === visit.paymentId
                            )?.abonement.typeService
                          }
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Дата
                            </Typography.Text>
                          </Typography>
                          {timeTables
                            .find((type) => type.id === visit.timeTableId)
                            ?.date.substring(0, 10)}
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Начало
                            </Typography.Text>
                          </Typography>
                          {timeTables
                            .find((type) => type.id === visit.timeTableId)
                            ?.timeStart.substring(11, 16)}
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Конец
                            </Typography.Text>
                          </Typography>
                          {timeTables
                            .find((type) => type.id === visit.timeTableId)
                            ?.timeEnd.substring(11, 16)}
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Тренер
                            </Typography.Text>
                          </Typography>
                          {
                            users.find(
                              (user) =>
                                user.id ===
                                coachs.find(
                                  (coach) =>
                                    coach.userId ===
                                    timeTables.find(
                                      (type) => type.id === visit.timeTableId
                                    )?.coachId
                                )?.userId
                            )?.fio
                          }
                        </Col>
                        <Col span={4}>
                          <Button
                            type="primary"
                            danger
                            style={{ float: "right" }}
                            onClick={() => deleteVisit({ id: visit.id })}
                          >
                            Отменить
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          )}
          {validVisits.length === 0 && (
            <Card title="Действительные посещения">
              <p>У вас нет запланированных тренировок.</p>
            </Card>
          )}
          {pastPresentVisits.length > 0 && (
            <Card title="Прошедшие посещения (присутствовал)">
              <List
                dataSource={pastPresentVisits}
                renderItem={(visit) => (
                  <List.Item>
                    <Card style={{ backgroundColor: "#90EE90", width: "100%" }}>
                      <Row>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Услуга
                            </Typography.Text>
                          </Typography>
                          {
                            paymentsByClient.find(
                              (type) => type.id === visit.paymentId
                            )?.abonement.typeService
                          }
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Дата
                            </Typography.Text>
                          </Typography>
                          {timeTables
                            .find((type) => type.id === visit.timeTableId)
                            ?.date.substring(0, 10)}
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Начало
                            </Typography.Text>
                          </Typography>
                          {timeTables
                            .find((type) => type.id === visit.timeTableId)
                            ?.timeStart.substring(11, 16)}
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Конец
                            </Typography.Text>
                          </Typography>
                          {timeTables
                            .find((type) => type.id === visit.timeTableId)
                            ?.timeEnd.substring(11, 16)}
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Тренер
                            </Typography.Text>
                          </Typography>
                          {
                            users.find(
                              (user) =>
                                user.id ===
                                coachs.find(
                                  (coach) =>
                                    coach.userId ===
                                    timeTables.find(
                                      (type) => type.id === visit.timeTableId
                                    )?.coachId
                                )?.userId
                            )?.fio
                          }
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{
                                fontSize: "16px",
                                alignContent: "center",
                                marginBottom: "50%",
                              }}
                            >
                              Выполнена
                            </Typography.Text>
                          </Typography>
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          )}
          {pastPresentVisits.length === 0 && (
            <Card title="Прошедшие посещения (присутствовал)">
              <p>У вас нет посещенных тренировок.</p>
            </Card>
          )}
          {pastAbsentVisits.length > 0 && (
            <Card title="Прошедшие посещения (пропустил)">
              <List
                dataSource={pastAbsentVisits}
                renderItem={(visit) => (
                  <List.Item>
                    <Card style={{ backgroundColor: "#FFB6C1", width: "100%" }}>
                      <Row>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Услуга
                            </Typography.Text>
                          </Typography>
                          {
                            paymentsByClient.find(
                              (type) => type.id === visit.paymentId
                            )?.abonement.typeService
                          }
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Дата
                            </Typography.Text>
                          </Typography>
                          {timeTables
                            .find((type) => type.id === visit.timeTableId)
                            ?.date.substring(0, 10)}
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Начало
                            </Typography.Text>
                          </Typography>
                          {timeTables
                            .find((type) => type.id === visit.timeTableId)
                            ?.timeStart.substring(11, 16)}
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Конец
                            </Typography.Text>
                          </Typography>
                          {timeTables
                            .find((type) => type.id === visit.timeTableId)
                            ?.timeEnd.substring(11, 16)}
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{ fontSize: "16px" }}
                            >
                              Тренер
                            </Typography.Text>
                          </Typography>
                          {
                            users.find(
                              (user) =>
                                user.id ===
                                coachs.find(
                                  (coach) =>
                                    coach.userId ===
                                    timeTables.find(
                                      (type) => type.id === visit.timeTableId
                                    )?.coachId
                                )?.userId
                            )?.fio
                          }
                        </Col>
                        <Col span={4}>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{
                                fontSize: "16px",
                                alignContent: "center",
                                marginBottom: "50%",
                              }}
                            >
                              Пропущена
                            </Typography.Text>
                          </Typography>
                          <Typography>
                            <Typography.Text
                              strong
                              style={{
                                fontSize: "16px",
                                alignContent: "center",
                                marginBottom: "50%",
                              }}
                            >
                              или Не отмечена
                            </Typography.Text>
                          </Typography>
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          )}
          {pastAbsentVisits.length === 0 && (
            <Card title="Прошедшие посещения (пропустил)">
              <p>Вы ещё не пропустили ни одной тренировки!</p>
            </Card>
          )}
        </div>
      ) : (
        "Для отображения данной страницы необходима авторизация!"
      )}
    </React.Fragment>
  );
};
export default MyVisits;
