import React, { useEffect } from "react";
import "./Style.css";
import { Button, Card, Typography } from "antd";
//import { Link } from "react-router-dom";
const Abonement = ({
  user,
  abonements,
  setAbonements,
  setUpAbonement,
  removeAbonement,
}) => {
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

  return (
    <React.Fragment>
      <Typography>
        <h3>Абонементы</h3>
      </Typography>
      <Card>
        {abonements.map(
          ({
            id,
            name,
            cost,
            countVisits,
            countDays,
            countMonths,
            typeService,
            typeTraining,
          }) => (
            <div className="Abonement" key={id} id={id}>
              <Card>
                <Typography>
                  <h3 className="AbonementName">{name}</h3>
                </Typography>
                <br />
                Стоимость: {cost} Рублей <br />
                Количество посещений: {countVisits} <br />
                Количество дней: {countDays} <br />
                Количество месяцев: {countMonths} <br />
                Услуга: {typeService} <br />
                Тип тренировки: {typeTraining} <br />
                <br />
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
    </React.Fragment>
  );
};
export default Abonement;
