import React, { useState } from "react";
import { Table, Button, Flex, Spin } from "antd";

const TimeTableComponent = ({
  user,
  timeTables,
  serviceTypes,
  typeTrainings,
  coachs,
  users,
  setTimeTables,
  removeTimeTable,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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
  const currentDay = currentDate.getDay();
  const startOfWeek = new Date(
    currentDate.getTime() -
      (currentDay === 0 ? 6 : currentDay - 1) * 24 * 60 * 60 * 1000
  );
  const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Генерация дат для каждого дня недели
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000 - 1);
    dates.push(date.toISOString().slice(0, 10)); // Преобразуем дату в строку формата "YYYY-MM-DD"
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
                  new Date(timeTable.date).setHours(0, 0, 0, 0) >=
                    new Date(startOfWeek).setHours(0, 0, 0, 0) &&
                  new Date(timeTable.date).setHours(0, 0, 0, 0) <=
                    new Date(endOfWeek).setHours(23, 59, 59, 999)
              )
              .map((timeTable) =>
                new Date(timeTable.date).toISOString().slice(0, 10)
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
          new Date(timeTable.date).setHours(0, 0, 0, 0) >=
            new Date(startOfWeek).setHours(0, 0, 0, 0) &&
          new Date(timeTable.date).setHours(0, 0, 0, 0) <=
            new Date(endOfWeek).setHours(23, 59, 59, 999)
      )
      .forEach((timeTable) => {
        const timeStart = new Date(timeTable.timeStart);
        const timeEnd = new Date(timeTable.timeEnd);
        const scheduleDay = new Date(timeTable.date).toISOString().slice(0, 10);
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
      title: date,
      key: date,
      dataIndex: date,
      render: (text, record) => {
        const cellData = record[date];
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
                      user.userRole == "admin" ? (
                        <div className="button-container">
                          <Button className="edit-button" type="primary">
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
                      <Button className="add-button" type="primary">
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
                <Button className="add-button" type="primary">
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
          children:
            user.isAuthenticated && user.userRole === "admin" ? (
              <Button className="add-button" type="primary">
                +
              </Button>
            ) : (
              ""
            ),
          props: {
            style: { backgroundColor: "none" },
          },
        };
      },
    })),
  ];

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
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <div>
      <h2>Расписание на неделю</h2>
      <div className="date-controls">
        <Button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)
            )
          }
        >
          Предыдущая неделя
        </Button>
        <Button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
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
    </div>
  );
};

export default TimeTableComponent;
