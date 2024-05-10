import React, { useState } from "react";
import {
  Table,
  Typography,
  Button,
  Modal,
  Form,
  Select,
  Input,
  TimePicker,
  Flex,
  Spin,
} from "antd";
import "./Style.css";
import dayjs from "dayjs";
import moment from "moment";
const { Option } = Select;
const format = "HH:mm";
const Schedule = ({
  user,
  schedules,
  addSchedule,
  removeSchedule,
  setSchedules,
  weekDays,
  serviceTypes,
  typeTrainings,
  coachs,
  users,
}) => {
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  // Для функции обновления и добавления тренировки
  const [isEditing, setIsEditing] = useState(false);
  const modalTitle = isEditing ? "Изменить тренировку" : "Добавить тренировку";

  const contentStyle = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;

  if (
    !Array.isArray(weekDays) ||
    weekDays.length === 0 ||
    !Array.isArray(schedules) ||
    !Array.isArray(coachs) ||
    !Array.isArray(users) ||
    !Array.isArray(typeTrainings) ||
    !Array.isArray(serviceTypes)
  ) {
    return (
      <Flex gap="small" vertical>
        <Flex gap="small">
          <Spin tip="Loading" size="large">
            {content}
          </Spin>
        </Flex>
      </Flex>
    );
  }

  const handleMouseEnter = (schedule) => {
    if (schedule) {
      const timeStart = new Date(schedule.timeStart).getHours();
      const timeEnd = new Date(schedule.timeEnd).getHours();
      const highlightedIntervals = [];

      for (let hour = timeStart; hour < timeEnd; hour++) {
        highlightedIntervals.push(`${hour}:00 - ${hour + 1}:00`);
      }

      setHighlightedCells(highlightedIntervals);
    } else {
      setHighlightedCells([]);
    }
  };

  const handleMouseLeave = () => {
    setHighlightedCells([]);
  };

  const generateTableData = () => {
    const startTime = 8; // Начальное время
    const endTime = 20; // Конечное время
    const tableData = [];

    // Инициализация временных интервалов
    for (let hour = startTime; hour < endTime; hour++) {
      const timeSlot = `${hour}:00 - ${hour + 1}:00`;
      const row = {
        time: timeSlot,
        ...Array.from(weekDays).reduce(
          (acc, day) => ({
            ...acc,
            [day.day]: { list: [], rowSpan: 1 },
          }),
          {}
        ),
      };
      tableData.push(row);
    }

    // Заполнение информацией о тренировках
    schedules.forEach((schedule) => {
      const timeStart = new Date(schedule.timeStart);
      const timeEnd = new Date(schedule.timeEnd);
      const scheduleDay = schedule.dayWeek.day;
      const hourStart = timeStart.getHours();
      const hourEnd = timeEnd.getHours();
      const duration = hourEnd - hourStart;

      for (let hour = hourStart; hour < hourEnd; hour++) {
        const timeSlot = `${hour}:00 - ${hour + 1}:00`;
        let row = tableData.find((r) => r.time === timeSlot);

        if (hour === hourStart && row[scheduleDay]) {
          // Начало тренировки
          row[scheduleDay].list.push(schedule);
          row[scheduleDay].rowSpan = duration;
        } else {
          // Продолжение тренировки
          if (row[scheduleDay] && row[scheduleDay].list) {
            if (!row[scheduleDay].list.includes(schedule)) {
              row[scheduleDay].list.push(schedule);
            }
            row[scheduleDay].rowSpan = 0; // Скрыть ячейку, так как она будет объединена с предыдущей
          }
        }
      }
    });

    return tableData;
  };

  // Колонки для таблицы
  const columns = [
    {
      title: "Время",
      dataIndex: "time",
      key: "time",
      className: "time-interval-cell",
      onCell: (record) => ({
        className: highlightedCells.includes(record.time)
          ? "time-interval-highlight"
          : "",
      }),
    },
    ...weekDays.map((day) => ({
      title: day.day,
      key: day.day,
      dataIndex: day.day,
      render: (text, record) => {
        const cellData = record[day.day];
        if (cellData) {
          if (cellData.rowSpan > 0) {
            return {
              children: (
                <div
                  className="table-cell-content"
                  onMouseEnter={() => handleMouseEnter(cellData.list[0])}
                  onMouseLeave={handleMouseLeave}
                >
                  {cellData.list.map((event) => (
                    <div key={event.id}>
                      <p>
                        {
                          serviceTypes.find(
                            (type) => type.id === event.serviceTypeId
                          )?.nameService
                        }
                      </p>
                      <p>
                        {
                          typeTrainings.find(
                            (type) => type.id === event.typeTrainingId
                          )?.nameType
                        }
                      </p>
                      <p>{event.maxCount} человек</p>
                      <p>
                        {" "}
                        Тренер:
                        {
                          users.find(
                            (user) =>
                              user.id ===
                              coachs.find(
                                (coach) => coach.userId === event.coachId
                              )?.userId
                          )?.fio
                        }
                      </p>
                      {user.isAuthenticated == true &&
                      user.userRole == "admin" ? (
                        <div className="button-container">
                          <Button
                            className="edit-button"
                            type="primary"
                            onClick={() => handleEdit(event, record.time)}
                          >
                            Изменить
                          </Button>
                          <Button
                            className="delete-button"
                            type="primary"
                            danger
                            onClick={() => handleDelete(event)}
                          >
                            Удалить
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                  {cellData.list.length === 0 &&
                    (user.isAuthenticated && user.userRole === "admin" ? (
                      <Button
                        className="add-button"
                        type="primary"
                        onClick={() => handleAdd(day, record.time)}
                      >
                        +
                      </Button>
                    ) : (
                      ""
                    ))}
                </div>
              ),
              props: {
                rowSpan: cellData.rowSpan,
                style: {
                  backgroundColor:
                    cellData.list.length > 0 ? "#add8e6" : "none",
                },
              },
            };
          }
          return {
            children:
              user.isAuthenticated && user.userRole === "admin" ? (
                <Button
                  type="primary"
                  className="add-button"
                  onClick={() => handleAdd(day, record.time)}
                >
                  +
                </Button>
              ) : (
                ""
              ),
            props: {
              rowSpan: cellData.rowSpan,
              style: { backgroundColor: "none" },
            },
          };
        }
        return {
          children: null,
          props: {
            rowSpan: 0,
            style: { backgroundColor: "none" },
          },
        };
      },
    })),
  ];

  const windowReload = () => {
    window.location.reload(); // Обновить страницу
  };

  const handleEdit = (event, time) => {
    setIsEditing(true);
    // Открываем модальное окно для редактирования
    setVisible(true);

    // Получаем данные тренировки
    const { id, maxCount, serviceTypeId, typeTrainingId, coachId } = event;

    // Получаем названия услуг и тренировок по их идентификаторам
    const nameService = serviceTypes.find(
      (type) => type.id === serviceTypeId
    )?.nameService;
    const nameTraining = typeTrainings.find(
      (type) => type.id === typeTrainingId
    )?.nameType;

    // Получаем имя тренера по его идентификатору
    const coachName = users.find((user) => user.id === coachId)?.fio;

    const times = time.split(" - ");
    const timeStart = moment(times[0], format);
    const timeEnd = moment(times[1], format);

    // Заполняем форму данными из тренировки
    form.setFieldsValue({
      idForm: id, // Идентификатор тренировки для обновления
      maxCountForm: maxCount,
      timeStartForm: timeStart,
      timeEndForm: timeEnd,
      dayWeekForm: event.dayWeek.day,
      nameServiceTypeForm: nameService,
      nameTrainingTypeForm: nameTraining,
      coachForm: coachName,
    });
  };

  const handleUpdateSchedule = (e) => {
    if (isEditing) {
      e = form.getFieldValue();
      const valueId = e.idForm;
      const valueNameService = e.nameServiceTypeForm;
      const valueNameTraining = e.nameTrainingTypeForm;
      const valueDayWeek = e.dayWeekForm;
      const valueNameCoach = e.coachForm;
      const valueMaxCount = e.maxCountForm;
      const valueTimeStart = e.timeStartForm;
      const valueTimeEnd = e.timeEndForm;

      // Преобразуем время в нужный формат
      const timeStart = dayjs(valueTimeStart).format("YYYY-MM-DDTHH:mm:ss");
      const timeEnd = dayjs(valueTimeEnd).format("YYYY-MM-DDTHH:mm:ss");

      // Находим день недели по его названию
      const dayWeekId = weekDays.find((day) => day.day === valueDayWeek)?.id;

      // Находим идентификаторы услуг и тренировок по их названиям
      const serviceTypeId = serviceTypes.find(
        (service) => service.nameService === valueNameService
      )?.id;
      const typeTrainingId = typeTrainings.find(
        (training) => training.nameType === valueNameTraining
      )?.id;

      // Находим идентификатор тренера по его имени
      const coachId = users.find((user) => user?.fio === valueNameCoach)?.id;

      // Создаем объект с обновленными данными тренировки
      const updatedSchedule = {
        id: valueId,
        maxCount: valueMaxCount,
        timeStart: timeStart,
        timeEnd: timeEnd,
        dayWeekId: Number(dayWeekId),
        serviceTypeId: Number(serviceTypeId),
        typeTrainingId: Number(typeTrainingId),
        coachId: Number(coachId),
      };

      console.log(updatedSchedule);

      // Отправляем запрос на обновление тренировки
      const updateSchedule = async () => {
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSchedule),
        };

        const response = await fetch(`api/Shedules/${valueId}`, requestOptions);
        return await response.json().then(
          (data) => {
            console.log(data);
            if (response.ok) {
              setVisible(false);
              window.location.reload(); // Обновляем страницу
            }
          },
          (error) => console.log(error)
        );
      };
      updateSchedule();
    } else {
      //  добавление новой тренировки
      const valueMaxCount = e.maxCountForm;
      const valueDate = new Date().toISOString().split("T")[0]; // Получаем дату в формате "2024-05-08"
      const valueTimeStart = dayjs(e.timeStartForm).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      const valueTimeEnd = dayjs(e.timeEndForm).format("YYYY-MM-DDTHH:mm:ss");

      const valueDayWeekId = weekDays.find(
        (weekDay) => weekDay && weekDay.day === e.dayWeekForm
      )?.id;
      const valueCoachId = users.find((user) => user?.fio === e.coachForm)?.id;
      const valueServiceTypeId = serviceTypes.find(
        (service) => service.nameService === e.nameServiceTypeForm
      )?.id;
      const valueTypeTrainingId = typeTrainings.find(
        (training) => training.nameType === e.nameTrainingTypeForm
      )?.id;

      const shedule = {
        maxCount: valueMaxCount,
        date: valueDate,
        timeStart: valueTimeStart,
        timeEnd: valueTimeEnd,
        dayWeekId: valueDayWeekId,
        coachId: valueCoachId,
        serviceTypeId: valueServiceTypeId,
        typeTrainingId: valueTypeTrainingId,
      };

      console.log("Новая тренировка : ", shedule);

      const createShedule = async () => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shedule),
        };

        console.log(requestOptions);
        const response = await fetch("api/Shedules/", requestOptions);
        return await response.json().then(
          (data) => {
            console.log(data);

            if (response.ok) {
              console.log(data);
              addSchedule(data);
              e.maxCountForm = "";
              e.timeStartForm = "";
              e.timeEndForm = "";
              e.dayWeekForm = "";
              e.coachForm = "";
              e.nameServiceTypeForm = "";
              e.nameTrainingTypeForm = "";
            }
          },

          (error) => console.log(error)
        );
      };
      createShedule();
      setVisible(false);
      windowReload(); // Обновить страницу
    }
  };

  const handleDelete = async ({ id }) => {
    const requestOptions = {
      method: "DELETE",
    };
    return await fetch(`api/Shedules/${id}`, requestOptions).then(
      (response) => {
        if (response.ok) {
          removeSchedule(id);
          setSchedules(schedules.filter((x) => x.id !== id));
          windowReload();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const handleAdd = (day, time) => {
    setIsEditing(false);
    setVisible(true);
    // Получить день недели из параметра day
    const dayOfWeek = day.day;
    const times = time.split(" - ");
    const timeStart = moment(times[0], format);
    const timeEnd = moment(times[1], format);
    // Установить значение поля dayWeekForm в форме
    form.setFieldsValue({
      dayWeekForm: dayOfWeek,
      timeStartForm: timeStart,
      timeEndForm: timeEnd,
    });
  };

  return (
    <React.Fragment>
      <Typography>
        <h1>Шаблон расписания тренировок</h1>
      </Typography>

      <Table
        dataSource={generateTableData()}
        columns={columns}
        pagination={false}
        bordered
      />

      <Modal
        title={modalTitle}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form
          style={{
            maxWidth: 500,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleUpdateSchedule}
          form={form}
        >
          <Form.Item
            name="dayWeekForm"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input style={{ color: "black" }} disabled />
          </Form.Item>
          <Form.Item
            name="timeStartForm"
            label="Время начала"
            rules={[
              { required: true, message: "Пожалуйста, выберите время начала!" },
            ]}
          >
            <TimePicker
              format={format}
              onChange={(time, timeString) => {
                console.log(timeString); // Выводит время в нужном формате
              }}
              minuteStep={60}
              style={{ width: "100%" }}
              disabledHours={() => {
                // Запрещаем выбор часов до 8 и после 19
                return [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23];
              }}
            />
          </Form.Item>
          <Form.Item
            name="timeEndForm"
            label="Время окончания"
            rules={[
              {
                required: true,
                message: "Пожалуйста, выберите время окончания!",
              },
            ]}
          >
            <TimePicker
              format={format}
              onChange={(time, timeString) => {
                console.log(timeString); // Выводит время в нужном формате
              }}
              minuteStep={60}
              style={{ width: "100%" }}
              disabledHours={() => {
                // Запрещаем выбор часов до 9 и после 20
                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 21, 22, 23];
              }}
            />
          </Form.Item>

          <Form.Item
            label="Услуга: "
            name="nameServiceTypeForm"
            rules={[
              {
                required: true,
                message: "Вы должны выбрать услугу",
              },
            ]}
          >
            <Select placeholder="Выберите услугу">
              {serviceTypes.map(({ id, nameService }) => (
                <Option key={id} value={nameService}>
                  {nameService}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Тренировка: "
            name="nameTrainingTypeForm"
            rules={[
              {
                required: true,
                message: "Вы должны выбрать тип тренировки",
              },
            ]}
          >
            <Select placeholder="Выберите тип тренировки">
              {typeTrainings.map(({ id, nameType }) => (
                <Option key={id} value={nameType}>
                  {nameType}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Количество людей: "
            name="maxCountForm"
            rules={[
              {
                required: true,
                message: "Вы должны ввести максимальное количество людей",
              },
            ]}
          >
            <Input placeholder="Количество людей" />
          </Form.Item>

          <Form.Item
            label="Тренер: "
            name="coachForm"
            rules={[
              {
                required: true,
                message: "Вы должны выбрать тренера",
              },
            ]}
          >
            <Select placeholder="Выберите тренера">
              {coachs.map((coach) => (
                <Option key={coach.id} value={coach.user.fio}>
                  {coach.user.fio}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => setVisible(false)}>Отменить</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                position: "absolute",
                right: 20,
              }}
            >
              Подтвердить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default Schedule;
