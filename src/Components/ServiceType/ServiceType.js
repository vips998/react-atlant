import { useEffect } from "react";

const ServiceType = ({ setServiceTypes }) => {
  useEffect(() => {
    const getServiceTypes = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/ServiceTypes/", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            setServiceTypes(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getServiceTypes();
  }, [setServiceTypes]);
};
export default ServiceType;
