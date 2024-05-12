import { useEffect } from "react";

const Client = ({ setClients }) => {
  useEffect(() => {
    const getClients = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/Clients/", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            setClients(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getClients();
  }, [setClients]);
};
export default Client;
