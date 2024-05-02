import React, { useEffect } from "react";
import { Card, Typography } from "antd";

const Profile = ({ user, setUsers }) => {
  useEffect(() => {
    const getUsers = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch(`api/Users/`, requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            setUsers(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getUsers();
  }, [setUsers]);

  return (
    <React.Fragment>
      <Typography>
        <h3>Ваш профиль</h3>
      </Typography>
      <Card>
        {user.map(
          ({
            id,
            nickname,
            fio,
            birthday,
            email,
            phonenumber,
            passwordHash,
          }) => (
            <div className="Abonement" key={id} id={id}>
              <Card>
                <br />
                Никнейм: {nickname}
                Ваше ФИО: {fio} <br />
                Дата рождения: {birthday} <br />
                Ваша почта: {email} <br />
                Номер телефона: {phonenumber} <br />
                пароль: {passwordHash} <br />
                <br />
              </Card>
            </div>
          )
        )}
      </Card>
    </React.Fragment>
  );
};
export default Profile;
