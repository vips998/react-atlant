import { useEffect } from "react";

const VisitClient = ({ user, setVisitsClient }) => {
  useEffect(() => {
    const getVisitsClient = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch(
        `/api/VisitRegisters/client/${user.id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            setVisitsClient(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getVisitsClient();
  }, [setVisitsClient]);
};
export default VisitClient;
