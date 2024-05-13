import React from "react";
import { Card, Typography, Button, Image, Modal } from "antd";

const ServicePage = ({
  user,
  serviceTypes,
  setServiceTypes,
  setUpServiceType,
  removeServiceType,
}) => {
  const deleteService = async ({ id }) => {
    console.log("id удаляющейся услуги");
    console.log(id);
    const requestOptions = {
      method: "DELETE",
    };
    return await fetch(`api/ServiceTypes/${id}`, requestOptions).then(
      (response) => {
        if (response.ok) {
          removeServiceType(id);
          setServiceTypes(serviceTypes.filter((x) => x.id !== id));
        } else if (response.status === 400) {
          Modal.error({
            title: "Ошибка",
            content:
              "Вы не можете удалить услугу, потому что на неё уже записались люди",
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const ServiceTypeItems = async ({ id }) => {
    const requestOptions = {
      method: "GET",
    };

    return await fetch(`api/ServiceTypes/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUpServiceType(data);
      });
  };

  return (
    <React.Fragment>
      <Typography>
        <h3>Услуги</h3>
      </Typography>
      <Card>
        {serviceTypes.map(({ id, nameService, imageLink, description }) => (
          <div className="Service" key={id}>
            <Card>
              <Typography>
                <h3 className="ServiceName">{nameService}</h3>
              </Typography>
              <Card style={{ fontSize: "18px" }}>
                {description} <br />
              </Card>
              <Image src={imageLink} />
            </Card>
            {user.isAuthenticated == true && user.userRole == "admin" ? (
              <Card>
                <Button type="primary" onClick={() => ServiceTypeItems({ id })}>
                  Изменить
                </Button>
                <Button
                  style={{ marginLeft: "20px" }}
                  type="primary"
                  danger
                  onClick={() => deleteService({ id })}
                >
                  Удалить
                </Button>
              </Card>
            ) : (
              ""
            )}
          </div>
        ))}
      </Card>
    </React.Fragment>
  );
};
export default ServicePage;
