import { useEffect } from "react";

const GetSchedule = ({ setSchedules }) => {
  useEffect(() => {
    const getShedules = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/Shedules/", requestOptions)
        .then((response) => response.json())
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
    getShedules();
  }, [setSchedules]);
};
export default GetSchedule;
