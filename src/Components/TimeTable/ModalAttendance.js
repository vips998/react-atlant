import React, { useEffect, useState } from "react";
import { Modal, Checkbox, List, Card, Button } from "antd";

const AttendanceModal = ({
  visible,
  onCancel,
  onSave,
  event,
  visitRegisters,
  payments,
  //clients,
  users,
}) => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    if (!visible) {
      // Сбрасываем состояние, когда модальное окно закрыто
      setAttendanceData([]);
    }
  }, [visible]);

  useEffect(() => {
    const filteredVisitRegisters = visitRegisters.filter(
      (visitRegister) => visitRegister.timeTableId === event.id
    );

    const data = filteredVisitRegisters.map((visitRegister) => {
      const payment = payments.find((p) => p.id === visitRegister.paymentId);
      const user = users.find((u) => u.id === payment.userId);
      return {
        id: visitRegister.id,
        present: visitRegister.isPresent,
        fio: user.fio || "N/A",
        paymentId: payment.id,
        timetableId: event.id,
      };
    });

    setAttendanceData(data);
  }, [visitRegisters, payments, users, event]);

  const handleAttendanceChange = (index, value) => {
    const updatedList = [...attendanceData];
    updatedList[index].present = value;
    setAttendanceData(updatedList);
  };

  const handleSave = () => {
    const updatedVisitRegisters = attendanceData.map((item) => ({
      id: item.id,
      isPresent: item.present,
      paymentId: item.paymentId,
      timeTableId: item.timetableId,
    }));
    onSave(updatedVisitRegisters);
    console.log("updatedVisitRegisters");
    console.log(updatedVisitRegisters);
    onCancel();
  };

  const handleDelete = (id) => {
    fetch(`/api/VisitRegisters/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Запись успешно удалена");
          // Обновляю состояние чтобы отразить удаление
          const updatedData = attendanceData.filter((item) => item.id !== id);
          setAttendanceData(updatedData);
        } else {
          throw new Error("Не удалось удалить запись");
        }
      })
      .catch((error) => {
        console.error("Ошибка при удалении записи:", error);
      });
  };

  return (
    <Modal
      mask={false}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSave}
      title={`Посещаемость для тренировки ${event.date}`}
    >
      <Card>
        <List
          dataSource={attendanceData}
          renderItem={(item, index) => (
            <List.Item>
              <Checkbox
                checked={item.present}
                onChange={(e) =>
                  handleAttendanceChange(index, e.target.checked)
                }
              >
                {item.fio}
              </Checkbox>
              <Button
                type="primary"
                danger
                onClick={() => handleDelete(item.id)}
              >
                Удалить
              </Button>
            </List.Item>
          )}
        />
      </Card>
    </Modal>
  );
};

export default AttendanceModal;
