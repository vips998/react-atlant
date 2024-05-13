import React, { useEffect, useState } from "react";
import "./Style.css";
import { Button, Card, Typography, Modal, Space } from "antd";
const Abonement = ({
  user,
  abonements,
  setAbonements,
  setUpAbonement,
  removeAbonement,
}) => {
  const [isModalAbonementVisible, setIsModalAbonementVisible] = useState(false);
  const [selectedAbonement, setSelectedAbonement] = useState({});

  useEffect(() => {
    const getAbonements = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch(`api/Abonements/`, requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            setAbonements(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getAbonements();
  }, [setAbonements]);

  const deleteItem = async ({ id }) => {
    const requestOptions = {
      method: "DELETE",
    };
    return await fetch(`api/Abonements/${id}`, requestOptions).then(
      (response) => {
        if (response.ok) {
          removeAbonement(id);
          setAbonements(abonements.filter((x) => x.id !== id));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const abonementItems = async ({ id }) => {
    const requestOptions = {
      method: "GET",
    };

    return await fetch(`api/Abonements/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUpAbonement(data);
      });
  };

  const showModalAbonement = async ({ id }) => {
    const requestOptions = {
      method: "GET",
    };
    return await fetch(`api/Abonements/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSelectedAbonement(data);
        setIsModalAbonementVisible(true);
      });
  };

  const handleOkAbonement = async () => {
    try {
      const clientId = user.id;
      const abonementId = selectedAbonement.id;

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isValid: true, // абонемент действителен
          countRemainTraining: selectedAbonement.countVisits, // количество оставшихся тренировок
          dateStart: new Date().toISOString().slice(0, 10),
          dateEnd: new Date(
            new Date().getTime() +
              selectedAbonement.countDays * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .slice(0, 10),
        }),
      };

      const response = await fetch(
        `/api/Payments?clientId=${clientId}&abonementId=${abonementId}`,
        requestOptions
      );

      if (response.ok) {
        console.log("Оплата успешно проведена");
        setIsModalAbonementVisible(false);
      } else {
        console.error("Ошибка проведения оплаты:", response.status);
      }
    } catch (error) {
      console.error("Ошибка оплаты:", error);
    }
  };

  const handleCancelAbonement = () => {
    setIsModalAbonementVisible(false);
  };

  return (
    <React.Fragment>
      <Typography>
        <h3>Абонементы</h3>
      </Typography>
      <Card>
        {abonements.map(
          ({ id, name, cost, countVisits, countDays, typeService }) => (
            <div className="Abonement" key={id} id={id}>
              <Card>
                <Typography>
                  <h3 className="AbonementName">{name}</h3>
                </Typography>
                <br />
                Стоимость: {cost} Рублей <br />
                Количество посещений: {countVisits} <br />
                Количество дней: {countDays} <br />
                Услуга: {typeService} <br />
                <br />
                {user.isAuthenticated == true && user.userRole == "client" ? (
                  <Button
                    type="primary"
                    onClick={() => showModalAbonement({ id })}
                  >
                    Купить
                  </Button>
                ) : (
                  ""
                )}
                {user.isAuthenticated == true && user.userRole == "admin" ? (
                  <Card>
                    <Button
                      type="primary"
                      onClick={() => abonementItems({ id })}
                    >
                      Изменить
                    </Button>
                    <Button
                      style={{ marginLeft: "20px" }}
                      type="primary"
                      danger
                      onClick={() => deleteItem({ id })}
                    >
                      Удалить
                    </Button>
                  </Card>
                ) : (
                  ""
                )}
              </Card>
            </div>
          )
        )}
      </Card>
      <Modal
        title={selectedAbonement.name}
        visible={isModalAbonementVisible}
        onCancel={handleCancelAbonement}
        footer={null}
      >
        <div>
          <h3>Подробная информация об абонементе</h3>
          <ul>
            <li>Количество посещений: {selectedAbonement.countVisits}</li>
            <li>Количество дней: {selectedAbonement.countDays}</li>
            <li>Доступный вид спорта: {selectedAbonement.typeService}</li>
            <li>Стоимость абонемента: {selectedAbonement.cost} рублей</li>
          </ul>
        </div>
        <Space>
          <Button
            onClick={handleCancelAbonement}
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
            }}
            type="default"
          >
            Отменить
          </Button>
          <Button
            onClick={handleOkAbonement}
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
            }}
            type="primary"
            htmlType="submit"
          >
            Подтвердить покупку
          </Button>
        </Space>
      </Modal>
    </React.Fragment>
  );
};
export default Abonement;
