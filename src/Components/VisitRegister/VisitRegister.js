import { useEffect } from "react";

const VisitRegister = ({ setVisitRegisters }) => {
  useEffect(() => {
    const getVisitRegisters = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/VisitRegisters/", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            setVisitRegisters(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getVisitRegisters();
  }, [setVisitRegisters]);
};
export default VisitRegister;
