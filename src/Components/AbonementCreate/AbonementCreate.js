import React, { useEffect, useState } from "react";
import "./Style.css";
import {
  Typography,
  Form,
  Button,
  Input,
  Modal,
  Space,
  Select,
  Card,
} from "antd";

const { Option } = Select;

const AbonementCreate = ({
  abonements,
  user,
  addAbonement,
  upAbonement,
  setUpAbonement,
  setAbonements,
  serviceTypes,
  typeTrainings,
}) => {
  //console.log(abonement)

  // Изменение абонемента
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [isTypeTrainingModalOpen, setIsTypeTrainingModalOpen] = useState(false);
  const [isTypeTrainingCreateModalOpen, setIsTypeTrainingCreateModalOpen] =
    useState(false);
  // открытие модального окна с типами тренировок
  const showTypeTrainingModal = () => {
    setIsTypeTrainingModalOpen(true);
  };

  const handleTypeTrainingModalClose = () => {
    setIsTypeTrainingModalOpen(false);
  };

  // Выбор типа абонемента из 2-го модального окна
  const handleTypeSelection = (id, nameType) => {
    //e.preventDefault(); // Закрываем модальное окно с выбором типа тренировки
    handleTypeTrainingModalClose();
    // Отобразим выбранный тип тренировки в модальном окне "Абонемент"
    form.setFieldsValue({
      typeTrainingAbonement: nameType,
    });
    console.log(nameType);
  };

  // добавление нового типа тренировок
  // открытие модального окна с типами тренировок
  const showTypeTrainingCreateModal = () => {
    setIsTypeTrainingCreateModalOpen(true);
  };

  // закрытие модального окна
  const handleTypeTrainingCreateModalClose = () => {
    setIsTypeTrainingCreateModalOpen(false);
  };

  useEffect(() => {
    console.log(JSON.stringify(upAbonement));
    if (JSON.stringify(upAbonement) !== "{}") {
      setIsModalOpen(true);
      updateAbonement();
    }
    // setName(upGame.name);
    // setDeveloper(upGame.developer);
    // setMode(upGame.mode);
    console.log(11111);
  }, [upAbonement]);

  const showModal = () => {
    form.setFieldsValue({
      name: "",
      cost: "",
      countVisits: "",
      countDays: "",
      countMonths: "",
      typeService: "",
      typeTraining: "",
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

  const handleModalCloseAndRefresh = () => {
    handleCancel(); // Закрыть модальное окно
    window.location.reload(); // Обновить страницу
  };

  const updateAbonement = () => {
    form.setFieldsValue({
      idAbonement: upAbonement.id,
      nameAbonement: upAbonement.name,
      costAbonement: upAbonement.cost,
      countVisitsAbonement: upAbonement.countVisits,
      countDaysAbonement: upAbonement.countDays,
      countMonthsAbonement: upAbonement.countMonths,
      typeServiceAbonement: upAbonement.typeService,
      typeTrainingAbonement: upAbonement.typeTraining,
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
    const valueCountMonths = e.countMonthsAbonement;
    const valueTypeService = e.typeServiceAbonement;
    const valueTypeTraining = e.typeTrainingAbonement;

    const abonement = {
      id: valueId,
      name: valueName,
      cost: Number(valueCost),
      countVisits: Number(valueCountVisit),
      countDays: Number(valueCountDays),
      countMonths: Number(valueCountMonths),
      typeService: valueTypeService,
      typeTraining: valueTypeTraining,
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
        setUpAbonement({});
        handleOk();
        e.nameAbonement = "";
        e.costAbonement = "";
        e.countVisitsAbonement = "";
        e.countDaysAbonement = "";
        e.countMonthsAbonement = "";
        e.typeServiceAbonement = "";
        e.typeTrainingAbonement = "";
      });
  };

  const handleSubmit = (e) => {
    //e.preventDefault();
    const valueName = e.nameAbonement;
    const valueCost = e.costAbonement;
    const valueCountVisit = e.countVisitsAbonement;
    const valueCountDays = e.countDaysAbonement;
    const valueCountMonths = e.countMonthsAbonement;
    const valueTypeService = e.typeServiceAbonement;
    const valueTypeTraining = e.typeTrainingAbonement;

    const abonement = {
      name: valueName,
      cost: Number(valueCost),
      countVisits: Number(valueCountVisit),
      countDays: Number(valueCountDays),
      countMonths: Number(valueCountMonths),
      typeService: valueTypeService,
      typeTraining: valueTypeTraining,
    };

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
            e.target.elements.nameAbonement.value = "";
            e.target.elements.costAbonement.value = "";
            e.target.elements.countVisitsAbonement.value = "";
            e.target.elements.countDaysAbonement.value = "";
            e.target.elements.countMonthsAbonement.value = "";
            e.target.elements.typeServiceAbonement.value = "";
            e.target.elements.typeTrainingAbonement.value = "";
          }
        },

        (error) => console.log(error)
      );
    };
    createAbonement();
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
            onOk={handleOk}
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
              onFinish={(values) => {
                handleSubmit(values);
                handleModalCloseAndRefresh();
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
                    required: false,
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
                    required: false,
                  },
                ]}
              >
                <Input placeholder="Количество дней" />
              </Form.Item>
              <Form.Item
                label="Количество месяцев: "
                name="countMonthsAbonement"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input placeholder="Количество месяцев" />
              </Form.Item>
              <Form.Item
                label="Тип услуги: "
                name="typeServiceAbonement"
                rules={[
                  {
                    required: true,
                    message: "Выберите тип услуги",
                  },
                ]}
              >
                <Select placeholder="Выберите услугу">
                  {serviceTypes.map(({ id, nameService }) => (
                    <Option key={id} value={id}>
                      {nameService}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Тип тренировки: " name="typeTrainingAbonement">
                <Input.Group
                  compact
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Form.Item
                    name="typeTrainingAbonement"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Выберите тип тренировки",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "calc(100% - 100px)", color: "black" }}
                      disabled
                      placeholder="Тип тренировки не выбран"
                    />
                  </Form.Item>
                  <Form.Item noStyle>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={showTypeTrainingModal}
                      style={{ width: "100px" }}
                    >
                      Выбрать
                    </Button>
                  </Form.Item>
                </Input.Group>
              </Form.Item>
              <Modal
                title="Выберите тип тренировки"
                open={isTypeTrainingModalOpen}
                onCancel={handleTypeTrainingModalClose}
                footer={null}
              >
                {/* Список типов тренировок */}
                <Typography>
                  <h3>Типы тренировки</h3>
                  <Card>
                    {typeTrainings.map(({ id, nameType }) => (
                      <div className="TypeTraining" key={id} id={id}>
                        {/* здесь можно тоже проверку на пользователя*/}
                        <Card>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h3>{nameType}</h3>
                            <Button.Group>
                              <Button style={{ width: "90px" }} type="primary">
                                Изменить
                              </Button>
                              <Button
                                style={{ width: "80px" }}
                                type="primary"
                                danger
                              >
                                Удалить
                              </Button>
                            </Button.Group>
                          </div>
                          <Button
                            type="primary"
                            style={{ marginTop: "10px", width: "100%" }}
                            onClick={() => handleTypeSelection(id, nameType)}
                          >
                            Выбрать
                          </Button>
                        </Card>
                      </div>
                    ))}
                  </Card>
                  <Card>
                    <Button
                      type="primary"
                      onClick={showTypeTrainingCreateModal}
                    >
                      Добавить новый тип
                    </Button>
                  </Card>
                </Typography>
                {/*3 модальное окно - добавление типа тренировки*/}
                <Modal
                  title="Новый тип тренировки"
                  open={isTypeTrainingCreateModalOpen}
                  onCancel={handleTypeTrainingCreateModalClose}
                  footer={null}
                >
                  <Form>
                    <Form.Item
                      label="Тип тренировки: "
                      name="newtypeTraining"
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                    >
                      <Input placeholder="Например: Групповая" />
                    </Form.Item>
                  </Form>
                  <Button onClick={handleTypeTrainingCreateModalClose}>
                    Отменить
                  </Button>
                  <Button
                    style={{
                      position: "absolute",
                      right: 20,
                    }}
                    type="primary"
                    //onClick={}
                  >
                    Подтвердить
                  </Button>
                </Modal>
              </Modal>
              <Space>
                {JSON.stringify(upAbonement) === "{}" ? (
                  <Button type="primary" htmlType="submit">
                    Добавить абонемент
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={AbonementUpdate}
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
