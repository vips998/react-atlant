import { useEffect } from "react";

const DayWeek = ({ setWeekDays }) => {
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
            setWeekDays(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getDayWeeks();
  }, [setWeekDays]);
};
export default DayWeek;
