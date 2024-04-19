import { useEffect } from "react";

export let coach = [{}];

const Coach = () => {
  useEffect(() => {
    const getCoachs = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/Coachs/", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            coach = data;
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getCoachs();
  });
};
export default Coach;
