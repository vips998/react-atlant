import { useEffect } from "react";

const TypeTraining = ({ setTypeTrainings }) => {
  useEffect(() => {
    const getTypeTrainings = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/TypeTrainings/", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            setTypeTrainings(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getTypeTrainings();
  }, [setTypeTrainings]);
};
export default TypeTraining;
