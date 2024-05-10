import React, { useState } from "react";
import "./Style.css";
import { Form, Button, Modal, DatePicker } from "antd";
//import moment from "moment"; // Для управления датами

const SheduleApply = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);

  const PostSheduleToTimeTable = async (dates) => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dates),
    };

    console.log(requestOptions);
    const response = await fetch("api/Shedules/", requestOptions);

    return await response.json().then(
      (data) => {
        console.log(data);
        if (response.ok) {
          Modal.success({
            content: "Шаблон успешно применен.",
          });
          setIsModalOpen(false);
        } else {
          Modal.error({
            content: "Что-то пошло не так(",
          });
        }
      },
      (error) => console.log(error),
      Modal.error({
        content: "Что-то пошло не так(",
      })
    );
  };

  const handleSubmit = () => {
    console.log(selectedDates);
    PostSheduleToTimeTable(selectedDates);
  };

  const handleWeekChange = (dates) => {
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[1]);
    const datesBetween = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      datesBetween.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1); // Используем setDate без создания нового объекта
    }
    console.log(datesBetween);

    const formatedDates = datesBetween.map((date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });
    console.log(formatedDates);
    setSelectedDates(formatedDates);
  };

  return (
    <React.Fragment>
      {user.isAuthenticated && user.userRole == "admin" ? (
        <div>
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            style={{
              marginTop: 20,
            }}
          >
            Применить Шаблон
          </Button>

          <Modal
            title="Применить тренировки"
            visible={isModalOpen}
            onOk={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          >
            <Form>
              <Form.Item label="Выберите неделю">
                <DatePicker.RangePicker
                  onChange={handleWeekChange}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};
export default SheduleApply;
