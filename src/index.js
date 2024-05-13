import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Abonement from "./Components/Abonement/Abonement";
import AbonementCreate from "./Components/AbonementCreate/AbonementCreate";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import LogIn from "./Components/Login/Login";
import LogOff from "./Components/LogOff/LogOff";
import Register from "./Components/Registration/Registration";
import GetSchedule from "./Components/Shedule/GetSchedule";
import Shedule from "./Components/Shedule/Shedule";
import DayWeek from "./Components/DayWeek/DayWeek";
import TypeTraining from "./Components/TypeTraining/TypeTraining";
import ServiceType from "./Components/ServiceType/ServiceType";
import Coach from "./Components/Coach/Coach";
import User from "./Components/User/User";
import Profile from "./Components/Profile/Profile";
import PaymentsByClient from "./Components/PaymentByClient/PaymentsByClient";
import { jwtDecode } from "jwt-decode";
import SheduleApply from "./Components/Shedule/SheduleApply";
import TimeTable from "./Components/TimeTable/TimeTable";
import GetTimeTable from "./Components/TimeTable/GetTimeTable";
import MyVisits from "./Components/MyVisits/MyVisits";
import VisitClient from "./Components/MyVisits/VisitsClient";
import VisitRegister from "./Components/VisitRegister/VisitRegister";
import Client from "./Components/Client/Client";
import Payment from "./Components/Payment/Payment";
import ServicePage from "./Components/ServiceType/ServicePage";
import ServiceTypeCreate from "./Components/ServiceType/ServiceCreate";
import CoachPage from "./Components/Coach/CoachPage";

function App() {
  const [abonements, setAbonements] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentsByClient, setPaymentsByClient] = useState([]);
  const addAbonement = (abonement) => setAbonements([...abonements, abonement]);
  const removeAbonement = (removeID) =>
    setAbonements(abonements.filter(({ Id }) => Id !== removeID));
  const [user, setUser] = useState({
    isAuthenticated: false,
    id: "",
    userName: "",
    userRole: "",
    balance: 0,
  });
  const [upAbonement, setUpAbonement] = useState({});
  const [schedules, setSchedules] = useState({});
  const addSchedule = (schedule) => setSchedules([...schedules, schedule]);
  const removeSchedule = (removeID) =>
    setSchedules(schedules.filter(({ Id }) => Id !== removeID));
  const [weekDays, setWeekDays] = useState({});

  const [serviceTypes, setServiceTypes] = useState([]);
  const [upServiceType, setUpServiceType] = useState({});
  const addServiceType = (serviceType) =>
    setServiceTypes([...serviceTypes, serviceType]);
  const removeServiceType = (removeID) =>
    setServiceTypes(serviceTypes.filter(({ Id }) => Id !== removeID));
  const [typeTrainings, setTypeTrainings] = useState([]);

  const [coachs, setCoachs] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);

  const [timeTables, setTimeTables] = useState({});
  const addTimeTable = (timeTable) => setTimeTables([...timeTables, timeTable]);
  const removeTimeTable = (removeID) =>
    setTimeTables(timeTables.filter(({ Id }) => Id !== removeID));

  const [visitsClient, setVisitsClient] = useState([]);
  const removeVisitRegister = (removeID) =>
    setVisitsClient(visitsClient.filter(({ Id }) => Id !== removeID));

  const [visitRegisters, setVisitRegisters] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      // Decode the token to get user information
      const decodedToken = jwtDecode(token);
      // Check if the token is expired
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        // Token is expired. Remove it and reset the user state.
        localStorage.removeItem("jwt");
      } else {
        // Token is valid. Set the user state using the information from the token.
        setUser({
          isAuthenticated: true,
          id: decodedToken.id,
          userName: decodedToken.userName,
          userRole: decodedToken.userRole,
          fio: decodedToken.fio,
          birthday: decodedToken.birthday,
          phonenumber: decodedToken.phonenumber,
          email: decodedToken.email,
          clientBalance: parseFloat(decodedToken.clientBalance),
        });
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route
            path="/Profile"
            element={
              <>
                <PaymentsByClient
                  user={user}
                  setPaymentsByClient={setPaymentsByClient}
                />
                <Profile
                  user={user}
                  setUser={setUser}
                  paymentsByClient={paymentsByClient}
                />
              </>
            }
          ></Route>

          <Route
            path="/MyVisits"
            element={
              <>
                <VisitClient user={user} setVisitsClient={setVisitsClient} />

                <PaymentsByClient
                  user={user}
                  setPaymentsByClient={setPaymentsByClient}
                />
                <GetTimeTable setTimeTables={setTimeTables} />
                <Coach setCoachs={setCoachs} />
                <Client setClients={setClients} />
                <User setUsers={setUsers} />
                <MyVisits
                  user={user}
                  paymentsByClient={paymentsByClient}
                  timeTables={timeTables}
                  visitsClient={visitsClient}
                  setVisitsClient={setVisitsClient}
                  removeVisitRegister={removeVisitRegister}
                  coachs={coachs}
                  clients={clients}
                  users={users}
                />
              </>
            }
          ></Route>

          <Route
            path="/TimeTables"
            element={
              <>
                <PaymentsByClient
                  user={user}
                  setPaymentsByClient={setPaymentsByClient}
                />
                <Payment setPayments={setPayments} />
                <ServiceType setServiceTypes={setServiceTypes} />
                <TypeTraining setTypeTrainings={setTypeTrainings} />
                <User setUsers={setUsers} />
                <Coach setCoachs={setCoachs} />
                <GetTimeTable setTimeTables={setTimeTables} />
                <VisitRegister setVisitRegisters={setVisitRegisters} />
                <TimeTable
                  user={user}
                  serviceTypes={serviceTypes}
                  typeTrainings={typeTrainings}
                  coachs={coachs}
                  users={users}
                  timeTables={timeTables}
                  setTimeTables={setTimeTables}
                  removeTimeTable={removeTimeTable}
                  addTimeTable={addTimeTable}
                  paymentsByClient={paymentsByClient}
                  payments={payments}
                  visitRegisters={visitRegisters}
                />
              </>
            }
          />

          <Route
            path="/Shedules"
            element={
              <>
                <DayWeek setWeekDays={setWeekDays} />
                <ServiceType setServiceTypes={setServiceTypes} />
                <TypeTraining setTypeTrainings={setTypeTrainings} />
                <User setUsers={setUsers} />
                <Coach setCoachs={setCoachs} />
                <GetSchedule setSchedules={setSchedules} />
                <SheduleApply user={user} schedules={schedules} />
                <Shedule
                  user={user}
                  weekDays={weekDays}
                  serviceTypes={serviceTypes}
                  typeTrainings={typeTrainings}
                  coachs={coachs}
                  users={users}
                  schedules={schedules}
                  setSchedules={setSchedules}
                  addSchedule={addSchedule}
                  removeSchedule={removeSchedule}
                />
              </>
            }
          />
          <Route
            path="/Abonements"
            element={
              <>
                <ServiceType
                  setServiceTypes={setServiceTypes}
                  addServiceType={addServiceType}
                />
                <TypeTraining setTypeTrainings={setTypeTrainings} />

                <AbonementCreate
                  user={user}
                  setUser={setUser}
                  addAbonement={addAbonement}
                  upAbonement={upAbonement}
                  setUpAbonement={setUpAbonement}
                  abonements={abonements}
                  setAbonements={setAbonements}
                  serviceTypes={serviceTypes}
                  setServiceTypes={setServiceTypes}
                  typeTrainings={typeTrainings}
                  removeServiceType={removeServiceType}
                />

                <Abonement
                  user={user}
                  setUser={setUser}
                  addAbonement={addAbonement}
                  upAbonement={upAbonement}
                  setUpAbonement={setUpAbonement}
                  abonements={abonements}
                  setAbonements={setAbonements}
                  removeAbonement={removeAbonement}
                />
              </>
            }
          />

          <Route
            path="/Services"
            element={
              <>
                <ServiceType setServiceTypes={setServiceTypes} />
                <ServiceTypeCreate
                  user={user}
                  setUser={setUser}
                  addServiceType={addServiceType}
                  upServiceType={upServiceType}
                  setUpServiceType={setUpServiceType}
                  serviceTypes={serviceTypes}
                  setServiceTypes={setServiceTypes}
                />
                <ServicePage
                  user={user}
                  serviceTypes={serviceTypes}
                  setServiceTypes={setServiceTypes}
                  setUpServiceType={setUpServiceType}
                  removeServiceType={removeServiceType}
                />
              </>
            }
          ></Route>

          <Route
            path="/Coachs"
            element={
              <>
                <User setUsers={setUsers} />
                <Coach setCoachs={setCoachs} />
                <CoachPage coachs={coachs} users={users} />
              </>
            }
          />

          <Route
            path="/register"
            element={<Register user={user} setUser={setUser} />}
          />
          <Route
            path="/login"
            element={<LogIn user={user} setUser={setUser} />}
          />
          <Route path="/logoff" element={<LogOff setUser={setUser} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
