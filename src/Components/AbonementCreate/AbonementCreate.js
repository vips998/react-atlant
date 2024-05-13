import React, { useEffect, useState } from "react";
import "./Style.css";
import { Typography, Form, Button, Input, Modal, Space, Card } from "antd";

const AbonementCreate = ({
  abonements,
  user,
  addAbonement,
  upAbonement,
  setUpAbonement,
  setAbonements,
  serviceTypes,
  //setServiceTypes,
  //addServiceType,
  //removeServiceType,
}) => {
  // Изменение абонемента
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // для услуг
  const [isTypeServiceModalOpen, setIsTypeServiceModalOpen] = useState(false);

  // открытие модального окна с услугами
  const showTypeServiceModal = () => {
    setIsTypeServiceModalOpen(true);
  };
  const handleTypeServiceModalClose = () => {
    setIsTypeServiceModalOpen(false);
  };

  // Выбор услуги из 2-го модального окна
  const handleServiceSelection = (id, nameService) => {
    //e.preventDefault(); // Закрываем модальное окно с выбором типа тренировки
    handleTypeServiceModalClose();
    // Отобразим выбранный тип тренировки в модальном окне
    form.setFieldsValue({
      typeServiceAbonement: nameService,
    });
    console.log(nameService);
  };

  /////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    console.log(JSON.stringify(upAbonement));
    if (JSON.stringify(upAbonement) !== "{}") {
      setIsModalOpen(true);
      updateAbonement();
    }
    console.log(11111);
  }, [upAbonement]);

  const showModal = () => {
    form.setFieldsValue({
      name: "",
      cost: "",
      countVisits: "",
      countDays: "",
      typeService: "",
    });
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setUpAbonement({});
  };

  // const windowReload = () => {
  //   window.location.reload(); // Обновить страницу
  // };

  const updateAbonement = () => {
    form.setFieldsValue({
      idAbonement: upAbonement.id,
      nameAbonement: upAbonement.name,
      costAbonement: upAbonement.cost,
      countVisitsAbonement: upAbonement.countVisits,
      countDaysAbonement: upAbonement.countDays,
      typeServiceAbonement: upAbonement.typeService,
    });
  };

  const AbonementUpdate = async (e) => {
    console.log(form.getFieldsValue());

    e = form.getFieldValue();
    const valueId = e.idAbonement;
    const valueName = e.nameAbonement;
    const valueCost = e.costAbonement;
    const valueCountVisit = e.countVisitsAbonement;
    const valueCountDays = e.countDaysAbonement;
    const valueTypeService = e.typeServiceAbonement;

    const abonement = {
      id: valueId,
      name: valueName,
      cost: Number(valueCost),
      countVisits: Number(valueCountVisit),
      countDays: Number(valueCountDays),
      typeService: valueTypeService,
    };

    console.log("проверка");
    console.log(abonement);

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(abonement),
    };

    return await fetch(`api/Abonements/${upAbonement.id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAbonements(abonements.map((x) => (x.id !== data.id ? x : data)));
        setUpAbonement({}); // очищаю upAbonement
        handleOk();
        e.nameAbonement = "";
        e.costAbonement = "";
        e.countVisitsAbonement = "";
        e.countDaysAbonement = "";
        e.typeServiceAbonement = "";
      });
  };

  const handleSubmit = (e) => {
    e = form.getFieldValue();
    const valueName = e.nameAbonement;
    const valueCost = e.costAbonement;
    const valueCountVisit = e.countVisitsAbonement;
    const valueCountDays = e.countDaysAbonement;
    const valueTypeService = e.typeServiceAbonement;

    const abonement = {
      name: valueName,
      cost: Number(valueCost),
      countVisits: Number(valueCountVisit),
      countDays: Number(valueCountDays),
      typeService: valueTypeService,
    };

    console.log("Новый абонемент : ", abonement);

    const createAbonement = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(abonement),
      };

      console.log(requestOptions);
      const response = await fetch("api/Abonements/", requestOptions);
      return await response.json().then(
        (data) => {
          console.log(data);

          if (response.ok) {
            console.log(data);
            addAbonement(data);
            e.nameAbonement = "";
            e.costAbonement = "";
            e.countVisitsAbonement = "";
            e.countDaysAbonement = "";
            e.typeServiceAbonement = "";
          }
        },

        (error) => console.log(error)
      );
    };
    createAbonement();
    handleCancel();
    //windowReload();
  };

  return (
    <React.Fragment>
      {user.isAuthenticated && user.userRole == "admin" ? (
        <>
          <h3>Добавление нового абонемента</h3>
          <Button type="primary" htmlType="button" onClick={showModal}>
            Добавить новый абонемент
          </Button>

          <Modal
            title="Абонемент"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              style={{
                maxWidth: 500,
              }}
              initialValues={{
                remember: true,
              }}
              form={form}
            >
              <Form.Item
                label="Название: "
                name="nameAbonement"
                rules={[
                  {
                    required: true,
                    message: "Введите название абонемента",
                  },
                ]}
              >
                <Input placeholder="Название" />
              </Form.Item>

              <Form.Item
                label="Стоимость(Руб.): "
                name="costAbonement"
                rules={[
                  {
                    required: true,
                    message: "Введите стоимость абонемента",
                  },
                ]}
              >
                <Input placeholder="Стоимость" />
              </Form.Item>

              <Form.Item
                label="Количество посещений: "
                name="countVisitsAbonement"
                rules={[
                  {
                    required: true,
                    message: "Введите количество посещений",
                  },
                ]}
              >
                <Input placeholder="Количество посещений" />
              </Form.Item>

              <Form.Item
                label="Количество дней: "
                name="countDaysAbonement"
                rules={[
                  {
                    required: true,
                    message: "Введите количество дней",
                  },
                ]}
              >
                <Input placeholder="Количество дней" />
              </Form.Item>

              <Form.Item label="Услуга: " name="typeServiceAbonement">
                <Input.Group
                  compact
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Form.Item
                    name="typeServiceAbonement"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Выберите услугу",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "calc(100% - 100px)", color: "black" }}
                      disabled
                      placeholder="Услуга не выбрана"
                    />
                  </Form.Item>
                  <Form.Item noStyle>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={showTypeServiceModal}
                      style={{ width: "100px" }}
                    >
                      Выбрать
                    </Button>
                  </Form.Item>
                </Input.Group>
              </Form.Item>
              <Modal
                title="Выберите услугу"
                open={isTypeServiceModalOpen}
                onCancel={handleTypeServiceModalClose}
                footer={null}
              >
                {/* Список услуг */}
                <Typography>
                  <h3>Список услуг</h3>
                  <Card>
                    {serviceTypes.map(({ id, nameService }) => (
                      <div className="TypeService" key={id} id={id}>
                        {/* здесь можно тоже проверку на пользователя*/}
                        <Card>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h3>{nameService}</h3>
                          </div>
                          <Button
                            type="primary"
                            style={{ marginTop: "10px", width: "100%" }}
                            onClick={() =>
                              handleServiceSelection(id, nameService)
                            }
                          >
                            Выбрать
                          </Button>
                        </Card>
                      </div>
                    ))}
                  </Card>
                </Typography>
              </Modal>
              <Space>
                {JSON.stringify(upAbonement) === "{}" ? (
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={handleSubmit}
                  >
                    Добавить абонемент
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="button"
                    onClick={() => {
                      form
                        .validateFields()
                        .then((values) => {
                          AbonementUpdate(values);
                        })
                        .catch((info) => {
                          console.log("Validate Failed:", info);
                        });
                    }}
                  >
                    Изменить абонемент
                  </Button>
                )}
              </Space>
            </Form>
          </Modal>
        </>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};
export default AbonementCreate;
