import React, { useEffect, useState } from "react";
import { Table, Typography, Button } from "antd";
import "./Style.css";

const Schedule = ({ schedules, setSchedules }) => {
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  useEffect(() => {
    // Получение дней недели
    const fetchWeekDays = async () => {
      const response = await fetch("api/DayWeeks/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setWeekDays(data.map((day) => day.day));
      console.log(data);
      console.log(weekDays);
    };

    // Получение тренировок из шаблона
    const fetchSchedules = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/Shedules/", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(
          (data) => {
            console.log("Data:", data);
            setSchedules(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };

    fetchWeekDays();
    fetchSchedules();
  }, [setSchedules]);

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

  if (!Array.isArray(schedules)) {
    return <div>Loading...</div>;
  }

  const generateTableData = () => {
    const startTime = 8; // Начальное время
    const endTime = 20; // Конечное время
    const tableData = [];

    // Инициализация временных интервалов
    for (let hour = startTime; hour < endTime; hour++) {
      const timeSlot = `${hour}:00 - ${hour + 1}:00`;
      const row = {
        time: timeSlot,
        ...Array.from(new Set(schedules.map((s) => s.dayWeek.day))).reduce(
          (acc, day) => ({
            ...acc,
            [day]: { list: [], rowSpan: 1 }, // rowSpan должен быть как минимум 1, чтобы отображать пустые ячейки
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

        if (hour === hourStart) {
          // Начало тренировки
          row[scheduleDay].list.push(schedule);
          row[scheduleDay].rowSpan = duration;
        } else {
          // Продолжение тренировки
          if (!row[scheduleDay].list.includes(schedule)) {
            row[scheduleDay].list.push(schedule);
          }
          row[scheduleDay].rowSpan = 0; // Скрыть ячейку, так как она будет объединена с предыдущей
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
    ...Array.from(
      new Set(schedules.map((schedule) => schedule.dayWeek.day))
    ).map((day) => ({
      title: day,
      key: day,
      render: (text, record) => {
        const cellData = record[day];
        if (cellData && cellData.rowSpan > 0) {
          return {
            children: (
              <div
                onMouseEnter={() => handleMouseEnter(cellData.list[0])} // Предполагаем, что list содержит объекты тренировок
                onMouseLeave={handleMouseLeave}
              >
                {cellData.list.map((event) => (
                  <div key={event.id}>
                    <p>{event.serviceType.nameService}</p>
                    <p>{event.typeTraining.nameType}</p>
                    <p>{event.maxCount} человек</p>
                    <p>{event.coach.user.fio}</p>
                    <Button type="primary" onClick={() => handleEdit(event)}>
                      Изменить
                    </Button>
                    <Button
                      style={{ marginLeft: "20px" }}
                      type="primary"
                      danger
                      onClick={() => handleDelete(event)}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
                {cellData.list.length === 0 && (
                  <Button
                    type="primary"
                    onClick={() => handleAdd(day, record.time)}
                  >
                    +
                  </Button>
                )}
              </div>
            ),
            props: {
              rowSpan: cellData.rowSpan,
              style: {
                backgroundColor: cellData.list.length > 0 ? "#add8e6" : "none",
              },
            },
          };
        }
        return {
          children: (
            <Button type="primary" onClick={() => handleAdd(day, record.time)}>
              +
            </Button>
          ),
          props: {
            rowSpan: cellData.rowSpan,
            style: { backgroundColor: "none" },
          },
        };
      },
    })),
  ];

  // Функции для обработки событий кнопок
  const handleEdit = () => {
    // Логика для изменения события
  };

  const handleDelete = () => {
    // Логика для удаления события
  };

  const handleAdd = () => {
    // Логика для добавления события
  };

  const tableData = generateTableData();

  return (
    <React.Fragment>
      <Typography>
        <h1>Расписание тренировок</h1>
      </Typography>

      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        bordered
      />
    </React.Fragment>
  );
};

export default Schedule;
