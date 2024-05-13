import React, { useEffect, useState } from "react";
import { Form, Button, Input, Modal, Space } from "antd";
const { TextArea } = Input;
const ServiceTypeCreate = ({
  user,
  serviceTypes,
  upServiceType,
  setUpServiceType,
  setServiceTypes,
  addServiceType,
}) => {
  // Изменение абонемента
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  /////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    console.log(JSON.stringify(upServiceType));
    if (JSON.stringify(upServiceType) !== "{}") {
      setIsModalOpen(true);
      updateServiceType();
    }
    console.log(11111);
  }, [upServiceType]);

  ////////////////////////////

  const showModal = () => {
    form.setFieldsValue({
      nameService: "",
      description: "",
    });
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setUpServiceType({});
  };

  // функция для обновления страницы
  const windowReload = () => {
    window.location.reload(); // Обновить страницу
  };

  const updateServiceType = () => {
    form.setFieldsValue({
      idServiceTypeForm: upServiceType.id,
      nameServiceForm: upServiceType.nameService,
      descriptionForm: upServiceType.description,
    });
  };

  const ServiceTypeUpdate = async (e) => {
    console.log(form.getFieldsValue());

    e = form.getFieldValue();
    const valueId = e.idServiceTypeForm;
    const valueNameService = e.nameServiceForm;
    const valueDescription = e.descriptionForm;

    const serviceType = {
      id: valueId,
      nameService: valueNameService,
      description: valueDescription,
    };

    console.log("проверка");
    console.log(serviceType);

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceType),
    };

    return await fetch(`api/ServiceTypes/${upServiceType.id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setServiceTypes(serviceTypes.map((x) => (x.id !== data.id ? x : data)));
        setUpServiceType({}); // очищаю upServiceType
        handleOk();
        e.nameServiceForm = "";
        e.descriptionForm = "";
      });
  };

  const handleSubmit = (e) => {
    //e.preventDefault();
    const valueNameService = e.nameServiceForm;
    const valueDescription = e.descriptionForm;

    const serviceType = {
      nameService: valueNameService,
      description: valueDescription,
    };

    console.log("Новая услуга : ", serviceType);

    const createServiceType = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceType),
      };

      console.log(requestOptions);
      const response = await fetch("api/ServiceTypes/", requestOptions);
      const data = await response.json();

      if (response.ok) {
        console.log(data);
        addServiceType(data);
        e.nameServiceForm = "";
        e.descriptionForm = "";
        // Обновление страницы
        windowReload();
      } else {
        console.log(data);
        Modal.error({
          title: "Ошибка",
          content: "Ошибка при добавлении услуги",
        });
      }
    };

    createServiceType();
    handleCancel();
  };

  return (
    <React.Fragment>
      {user.isAuthenticated && user.userRole == "admin" ? (
        <>
          <h3>Добавление новой услуги</h3>
          <Button type="primary" htmlType="button" onClick={showModal}>
            Добавить новую услугу
          </Button>

          <Modal
            title="Услуга"
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
              onFinish={handleSubmit}
              form={form}
            >
              <Form.Item
                label="Название: "
                name="nameServiceForm"
                rules={[
                  {
                    required: true,
                    message: "Введите название услуги",
                  },
                ]}
              >
                <Input placeholder="Название" />
              </Form.Item>

              <Form.Item
                label="Описание: "
                name="descriptionForm"
                rules={[
                  {
                    required: false,
                    message: "Введите описание",
                  },
                ]}
              >
                <TextArea rows={4} placeholder="Описание" />
              </Form.Item>

              <Space>
                {JSON.stringify(upServiceType) === "{}" ? (
                  <Button type="primary" htmlType="submit">
                    Добавить услугу
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="button"
                    onClick={() => {
                      form
                        .validateFields()
                        .then((values) => {
                          ServiceTypeUpdate(values);
                        })
                        .catch((info) => {
                          console.log("Validate Failed:", info);
                        });
                    }}
                  >
                    Изменить услугу
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
export default ServiceTypeCreate;
