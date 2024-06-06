import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  TimePicker,
  Select,
  Flex,
  Spin,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import AttendanceModal from "./ModalAttendance";
const { Option } = Select;
const TimeTableComponent = ({
  user,
  timeTables,
  serviceTypes,
  typeTrainings,
  coachs,
  clients,
  users,
  setTimeTables,
  removeTimeTable,
  addTimeTable,
  paymentsByClient,
  payments,
  visitRegisters,
}) => {
  const [isAttendanceModalVisible, setIsAttendanceModalVisible] =
    useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleAttendanceSave = (updatedAttendanceList) => {
    // Допустим, что updatedAttendanceList - это массив объектов с измененным статусом посещения
    updatedAttendanceList.forEach((attendance) => {
      fetch(`/api/VisitRegisters/${attendance.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Id: attendance.id,
          IsPresent: attendance.isPresent,
          TimeTableId: selectedEvent.id, // предположим, что selectedEvent содержит id расписания
          PaymentId: selectedEvent.paymentId, // убедитесь, что такое поле существует
        }),
      })
        .then((response) => {
          if (response.ok) {
            // Обновление данных на клиенте
            setSelectedEvent((prevEvent) => ({
              ...prevEvent,
              visitRegister: updatedAttendanceList,
            }));
            console.log("Посещаемость успешно обновлена");
          } else {
            throw new Error("Failed to update attendance");
          }
        })
        .catch((error) => {
          console.error("Ошибка при отправке запроса:", error);
        });
    });
    setIsAttendanceModalVisible(false);
  };

  const [currentDateForWeeks, setCurrentDateForWeeks] = useState(new Date());
  const [currentDate] = useState(new Date());
  const format = "HH:mm";

  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  // Для функции обновления и добавления тренировки
  const [isEditing, setIsEditing] = useState(false);
  const modalTitle = isEditing ? "Изменить тренировку" : "Добавить тренировку";
  // Проверка всех массивов на существование всех данных
  const contentStyle = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;

  if (
    !Array.isArray(coachs) ||
    !Array.isArray(users) ||
    !Array.isArray(typeTrainings) ||
    !Array.isArray(serviceTypes) ||
    !Array.isArray(timeTables)
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
  /////////////////////////////////////////////////////
  // Получаем даты на текущей неделе
  const currentDay = currentDateForWeeks.getDay();
  const startOfWeek = new Date(
    currentDateForWeeks.getTime() -
      (currentDay === 0 ? 6 : currentDay - 1) * 24 * 60 * 60 * 1000
  );
  const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Генерация дат для каждого дня недели
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000 - 1);
    dates.push(date.toLocaleDateString().slice(0, 10)); // Преобразуем дату в строку формата "YYYY-MM-DD"
  }
  console.log(dates);

  const transformedTimeTables = timeTables.map((timeTable) => {
    return {
      ...timeTable,
      date: timeTable.date.slice(0, 10), // Извлекаем только часть "YYYY-MM-DD" из даты
    };
  });
  console.log(transformedTimeTables);

  const generateTableData = () => {
    const startTime = 8; // Начальное время
    const endTime = 20; // Конечное время
    const tableData = [];

    // Инициализация временных интервалов
    for (let hour = startTime; hour < endTime; hour++) {
      const timeSlot = `${hour}:00 - ${hour + 1}:00`;
      const row = {
        time: timeSlot,
        ...Array.from(
          new Set(
            transformedTimeTables
              .filter(
                (timeTable) =>
                  new Date(timeTable.date).setUTCHours(0, 0, 0, 0) >=
                    new Date(startOfWeek).setUTCHours(0, 0, 0, 0) &&
                  new Date(timeTable.date).setUTCHours(0, 0, 0, 0) <=
                    new Date(endOfWeek).setUTCHours(23, 59, 59, 999)
              )
              .map((timeTable) =>
                new Date(timeTable.date).toLocaleDateString().slice(0, 10)
              )
          )
        ).reduce(
          (acc, date) => ({
            ...acc,
            [date]: { list: [], rowSpan: 1 },
          }),
          {}
        ),
      };
      tableData.push(row);
    }

    // Заполнение информацией о тренировках
    transformedTimeTables
      .filter(
        (timeTable) =>
          new Date(timeTable.date).setUTCHours(0, 0, 0, 0) >=
            new Date(startOfWeek).setUTCHours(0, 0, 0, 0) &&
          new Date(timeTable.date).setUTCHours(0, 0, 0, 0) <=
            new Date(endOfWeek).setUTCHours(23, 59, 59, 999)
      )
      .forEach((timeTable) => {
        const timeStart = new Date(timeTable.timeStart);
        const timeEnd = new Date(timeTable.timeEnd);
        const scheduleDay = new Date(timeTable.date)
          .toLocaleDateString()
          .slice(0, 10);
        const hourStart = timeStart.getHours();
        const hourEnd = timeEnd.getHours();
        const duration = hourEnd - hourStart;

        for (let hour = hourStart; hour < hourEnd; hour++) {
          const timeSlot = `${hour}:00 - ${hour + 1}:00`;
          const row = tableData.find((r) => r.time === timeSlot);

          if (row[scheduleDay]) {
            if (hour === hourStart) {
              // Начало тренировки
              row[scheduleDay].list.push(timeTable);
              row[scheduleDay].rowSpan = duration;
            } else {
              // Продолжение тренировки
              if (!row[scheduleDay].list.includes(timeTable)) {
                row[scheduleDay].list.push(timeTable);
              }
              row[scheduleDay].rowSpan = 0; // Скрываем ячейки продолжения тренировки
            }
          }
        }
      });
    return tableData;
  };

  // переводим в другой формат в 00.00.0000, чтобы сравнивать правильно даты и подсвечивать столбец
  const formattedCurrentDate = currentDate.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Колонки для таблицы
  const columns = [
    {
      title: "Время",
      dataIndex: "time",
      key: "time",
      className: "time-interval-cell",
      onCell: () => ({}),
    },
    ...dates.map((date) => ({
      title: (
        <div
          style={{
            color: date === formattedCurrentDate ? "#FFFF40" : "none",
          }}
        >
          {date}
        </div>
      ),
      key: date,
      dataIndex: date,
      render: (text, record) => {
        const cellData = record[date];
        // проверяем совпадает ли дата столбца с текущей датой
        const isToday = date === formattedCurrentDate;
        if (cellData) {
          if (cellData.rowSpan > 0) {
            return {
              children: (
                <div className="table-cell-content">
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
                      user.userRole == "client" &&
                      event.date >= currentDate.toISOString() ? (
                        <div className="button-container">
                          <Button
                            className="recordClientToTimeTable-button"
                            type="primary"
                            onClick={() => handleRecordToTimeTable(event)}
                          >
                            Записаться
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                      {(user.isAuthenticated == true &&
                        user.userRole == "coach" &&
                        user.id === event.coachId &&
                        event.date <= currentDate.toISOString()) ||
                      (user.isAuthenticated == true &&
                        user.userRole == "admin") ? (
                        <div className="button-container">
                          <Button
                            className="attendance-button"
                            type="primary"
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsAttendanceModalVisible(true);
                            }}
                          >
                            Посещаемость
                          </Button>
                          {selectedEvent && (
                            <AttendanceModal
                              visible={isAttendanceModalVisible}
                              onCancel={() =>
                                setIsAttendanceModalVisible(false)
                              }
                              onSave={handleAttendanceSave}
                              event={selectedEvent}
                              visitRegisters={visitRegisters}
                              users={users}
                              clients={clients}
                              payments={payments}
                              maskClosable={false}
                            />
                          )}
                        </div>
                      ) : (
                        ""
                      )}
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
                        onClick={() => handleAdd(date, record.time)}
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
                    cellData.list.length > 0
                      ? "#add8e6"
                      : isToday
                      ? "#ffff00"
                      : "none",
                  // Синий для тренировок, желтый для пустых ячеек сегодняшнего дня
                },
              },
            };
          }
          return {
            children:
              user.isAuthenticated && user.userRole === "admin" ? (
                <Button
                  className="add-button"
                  type="primary"
                  onClick={() => handleAdd(date, record.time)}
                >
                  +
                </Button>
              ) : (
                ""
              ),
            props: {
              rowSpan: cellData.rowSpan,
              style: {
                backgroundColor: isToday ? "#ffff00" : "none",
                // Желтый фон для пустых ячеек сегодняшнего дня
              },
            },
          };
        }
        return {
          children:
            user.isAuthenticated && user.userRole === "admin" ? (
              <Button
                className="add-button"
                type="primary"
                onClick={() => handleAdd(date, record.time)}
              >
                +
              </Button>
            ) : (
              ""
            ),
          props: {
            backgroundColor: isToday ? "#ffff00" : "none",
            // Желтый фон для пустых ячеек сегодняшнего дня
          },
        };
      },
    })),
  ];

  // функция для обновления страницы
  const windowReload = () => {
    window.location.reload(); // Обновить страницу
  };

  // Обработка удаления
  const handleDelete = async ({ id }) => {
    const requestOptions = {
      method: "DELETE",
    };
    return await fetch(`api/TimeTables/${id}`, requestOptions).then(
      (response) => {
        if (response.ok) {
          removeTimeTable(id);
          setTimeTables(timeTables.filter((x) => x.id !== id));
          //windowReload();
        } else if (response.status === 400) {
          Modal.error({
            content:
              "Нельзя удалить тренировку, потому что есть записанные клиенты!",
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };
  // Обработка добавления
  const handleAdd = (date, time) => {
    setIsEditing(false);
    setVisible(true);
    // Получить день недели из параметра day
    const dayOfWeek = date;
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

  // Обработка изменения
  const handleEdit = (event, time) => {
    setIsEditing(true);
    // Открываем модальное окно для редактирования
    setVisible(true);

    // Получаем данные тренировки
    const { id, date, maxCount, serviceTypeId, typeTrainingId, coachId } =
      event;

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
      dayWeekForm: date,
      nameServiceTypeForm: nameService,
      nameTrainingTypeForm: nameTraining,
      coachForm: coachName,
    });
  };

  // Общая функция для обновления и добавления
  const handleUpdateTimeTable = (e) => {
    if (isEditing) {
      e = form.getFieldValue();
      const valueId = e.idForm;
      const valueNameService = e.nameServiceTypeForm;
      const valueNameTraining = e.nameTrainingTypeForm;
      const valueDayWeek = e.dayWeekForm; // Получаем дату в формате "2024-05-08"
      const valueNameCoach = e.coachForm;
      const valueMaxCount = e.maxCountForm;
      const valueTimeStart = e.timeStartForm;
      const valueTimeEnd = e.timeEndForm;

      // Преобразуем время в нужный формат
      const timeStart = dayjs(valueTimeStart).format("YYYY-MM-DDTHH:mm:ss");
      const timeEnd = dayjs(valueTimeEnd).format("YYYY-MM-DDTHH:mm:ss");

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
      const updatedTimeTable = {
        id: valueId,
        maxCount: valueMaxCount,
        timeStart: timeStart,
        timeEnd: timeEnd,
        date: valueDayWeek,
        serviceTypeId: Number(serviceTypeId),
        typeTrainingId: Number(typeTrainingId),
        coachId: Number(coachId),
      };

      console.log(updatedTimeTable);

      // Отправляем запрос на обновление тренировки
      const updateSchedule = async () => {
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTimeTable),
        };

        const response = await fetch(
          `api/TimeTables/${valueId}`,
          requestOptions
        );
        const data = await response.json();

        if (response.ok) {
          setVisible(false);
          windowReload(); // Обновляем страницу
        } else if (response.status === 400) {
          Modal.error({
            content:
              "Нельзя изменить тренировку, потому что есть записанные клиенты!",
          });
        } else {
          // Обработка других ошибок
          console.error("Ошибка при обновлении расписания:", data);
        }
      };

      updateSchedule();
    } else {
      //  добавление новой тренировки
      const valueMaxCount = e.maxCountForm;
      // Преобразую дату из формата 00.00.0000
      const parts = e.dayWeekForm.split(".");
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      // Создать объект даты из частей
      const dateObject = new Date(Date.UTC(year, month - 1, day));

      // Преобразовать объект даты в строку в формате ISO
      const isoDateString = dateObject.toISOString();
      const valueDate = isoDateString; // Получаем дату в формате "2024-05-08"
      const valueTimeStart = dayjs(e.timeStartForm).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      const valueTimeEnd = dayjs(e.timeEndForm).format("YYYY-MM-DDTHH:mm:ss");

      const valueCoachId = users.find((user) => user?.fio === e.coachForm)?.id;
      const valueServiceTypeId = serviceTypes.find(
        (service) => service.nameService === e.nameServiceTypeForm
      )?.id;
      const valueTypeTrainingId = typeTrainings.find(
        (training) => training.nameType === e.nameTrainingTypeForm
      )?.id;

      const timeTable = {
        maxCount: valueMaxCount,
        date: valueDate,
        timeStart: valueTimeStart,
        timeEnd: valueTimeEnd,
        coachId: valueCoachId,
        serviceTypeId: valueServiceTypeId,
        typeTrainingId: valueTypeTrainingId,
      };

      console.log("Новая тренировка : ", timeTable);

      const createShedule = async () => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(timeTable),
        };

        console.log(requestOptions);
        const response = await fetch("api/TimeTables/", requestOptions);
        return await response.json().then(
          (data) => {
            console.log(data);

            if (response.ok) {
              console.log(data);
              addTimeTable(data);
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

  // Обработка записи клиента на тренировку
  const handleRecordToTimeTable = (date) => {
    console.log(paymentsByClient);
    console.log(date);
    if (!paymentsByClient || paymentsByClient.length === 0) {
      Modal.warning({
        content:
          "У вас нет активных абонементов. Приобретите один, чтобы записаться на тренировку.",
      });
      return;
    }

    const matchingAbonement = paymentsByClient.find(
      (payment) =>
        payment.paymentAbonement.some(
          (abonement) =>
            abonement.abonement?.typeService ===
            serviceTypes.find((type) => type.id === date.serviceTypeId)
              ?.nameService
        ) &&
        payment.isValid &&
        payment.countRemainTraining > 0 &&
        payment.dateEnd >= date.date
    );

    // Проверка наличия подходящего абонемента
    if (!matchingAbonement) {
      Modal.warning({
        content:
          "У вас нет абонемента, подходящего для этой услуги, или ваш абонемент недействителен, или у вас закончились посещения, или ваш абонемент истечет раньше планируемой тренировки.",
      });
      return;
    }

    const relevantVisitRegisters = visitRegisters.filter(
      (visitRegister) => visitRegister.timeTableId === date.id
    );
    const countVisitsOnTraining = relevantVisitRegisters.length;
    console.log(countVisitsOnTraining);
    // Проверка наличия подходящего абонемента
    if (countVisitsOnTraining === date.maxCount) {
      Modal.warning({
        content:
          "Вы не можете записаться, так как достигнуто максимальное количество записей(",
      });
      return;
    }

    // Получение идентификаторов оплаты и тренировки
    const visit = {
      paymentId: matchingAbonement.id,
      timetableId: date.id,
      isPresent: false,
      visitDate: false,
    };

    // Формирование запроса
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visit),
    };

    // Отправка запроса
    fetch("/api/VisitRegisters", requestOptions)
      .then((response) => {
        if (response.status === 200) {
          Modal.success({
            content: "Вы успешно записались!!!",
          });
          console.log("Успех");
        } else if (response.status === 409) {
          // Возник конфликт (уже существует запись)
          Modal.warning({
            content: "Вы уже записаны на эту тренировку.",
          });
        } else {
          // Возникла другая ошибка
          Modal.error({
            content:
              "Произошла ошибка при записи на тренировку. Пожалуйста, попробуйте еще раз.",
          });
        }
      })
      .catch((error) => {
        // Ошибка сети или сервера
        console.error(error);
        Modal.error({
          content:
            "Произошла ошибка при записи на тренировку. Пожалуйста, проверьте свое интернет-соединение и попробуйте еще раз.",
        });
      });
  };

  return (
    <div>
      <h2>Расписание на неделю</h2>
      <div className="date-controls">
        <Button
          type="primary"
          onClick={() =>
            setCurrentDateForWeeks(
              new Date(currentDateForWeeks.getTime() - 7 * 24 * 60 * 60 * 1000)
            )
          }
        >
          Предыдущая неделя
        </Button>
        <Button
          type="primary"
          onClick={() =>
            setCurrentDateForWeeks(
              new Date(currentDateForWeeks.getTime() + 7 * 24 * 60 * 60 * 1000)
            )
          }
        >
          Следующая неделя
        </Button>
      </div>
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
          onFinish={handleUpdateTimeTable}
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
    </div>
  );
};

export default TimeTableComponent;
