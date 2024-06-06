import { useEffect } from "react";

const GetAbonements = ({ setAbonements }) => {
  useEffect(() => {
    const getAbonements = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch(`api/Abonements/`, requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            console.log("DataAbonements:", data);
            setAbonements(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getAbonements();
  }, [setAbonements]);
};
export default GetAbonements;
