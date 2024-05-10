import { useEffect } from "react";

const GetTimeTable = ({ setTimeTables }) => {
  useEffect(() => {
    const getTimeTable = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/TimeTables/", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            setTimeTables(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getTimeTable();
  }, [setTimeTables]);
};
export default GetTimeTable;
