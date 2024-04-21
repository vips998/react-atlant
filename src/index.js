import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Abonement from "./Components/Abonement/Abonement";
import AbonementCreate from "./Components/AbonementCreate/AbonementCreate";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import LogIn from "./Components/Login/Login";
import LogOff from "./Components/LogOff/LogOff";
import Register from "./Components/Registration/Registration";
import Shedule from "./Components/Shedule/Shedule";
import TypeTraining from "./Components/TypeTraining/TypeTraining";
import ServiceType from "./Components/ServiceType/ServiceType";
//import Coach from "./Components/Coach/Coach";
//import DayWeek from "./Components/DayWeek/DayWeek";

function App() {
  const [abonements, setAbonements] = useState([]);
  const addAbonement = (abonement) => setAbonements([...abonements, abonement]);
  const removeAbonement = (removeID) =>
    setAbonements(abonements.filter(({ Id }) => Id !== removeID));
  const [user, setUser] = useState({
    isAuthenticated: false,
    id: "",
    userName: "",
    userRole: "",
  });
  const [upAbonement, setUpAbonement] = useState({});
  const [schedules, setSchedules] = useState({});
  const [serviceTypes, setServiceTypes] = useState([]);
  const addServiceType = (serviceType) =>
    setServiceTypes([...serviceTypes, serviceType]);
  const removeServiceType = (removeID) =>
    setServiceTypes(serviceTypes.filter(({ Id }) => Id !== removeID));
  const [typeTrainings, setTypeTrainings] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route
            path="/Shedules"
            element={
              <>
                {/*<Coach />*/}
                {/*<TypeTraining />*/}
                {/*<ServiceType />*/}
                {/*<DayWeek />*/}
                <Shedule schedules={schedules} setSchedules={setSchedules} />
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
                  addAbonement={addAbonement}
                  upAbonement={upAbonement}
                  setUpAbonement={setUpAbonement}
                  abonements={abonements}
                  setAbonements={setAbonements}
                  serviceTypes={serviceTypes}
                  typeTrainings={typeTrainings}
                  removeServiceType={removeServiceType}
                />

                <Abonement
                  user={user}
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
