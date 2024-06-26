import { useEffect } from "react";

const Coach = ({ setCoachs }) => {
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
            setCoachs(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getCoachs();
  }, [setCoachs]);
};
export default Coach;
