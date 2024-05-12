import { useEffect } from "react";

const PaymentAbonements = ({ user, setPaymentsByClient }) => {
  useEffect(() => {
    const getPaymentsAbonements = async () => {
      try {
        const response = await fetch(`/api/Payments/client/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setPaymentsByClient(data);
          console.log("Купленные абонементы" + data);
        } else {
          console.error(
            "Ошибка при получении списка абонементов:",
            response.status
          );
        }
      } catch (error) {
        console.error(
          "Ошибка при получении списка купленных абонементов:",
          error
        );
      }
    };
    getPaymentsAbonements();
  }, [setPaymentsByClient]);
};
export default PaymentAbonements;
