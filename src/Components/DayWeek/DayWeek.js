import { useEffect } from "react";

export let dayWeek = [{}];

const DayWeek = () => {
  useEffect(() => {
    const getDayWeeks = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/DayWeeks/", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            dayWeek = data;
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getDayWeeks();
  });
};
export default DayWeek;
