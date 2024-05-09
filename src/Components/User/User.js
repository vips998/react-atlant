import { useEffect } from "react";

const User = ({ setUsers }) => {
  useEffect(() => {
    const getUsers = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/Users/", requestOptions)
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
};
export default User;
