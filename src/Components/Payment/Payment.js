import { useEffect } from "react";

const Payment = ({ setPayments }) => {
  useEffect(() => {
    const getPayments = async () => {
      const requestOptions = {
        method: "GET",
      };
      return await fetch("api/Payments/", requestOptions)
        .then((response) => response.json())
        .then(
          (data) => {
            console.log("Data:", data);
            setPayments(data);
          },
          (error) => {
            console.log(error);
          }
        );
    };
    getPayments();
  }, [setPayments]);
};
export default Payment;
