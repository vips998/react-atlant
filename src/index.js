import React, { useState, useEffect } from "react";
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
import Profile from "./Components/Profile/Profile";
import { jwtDecode } from "jwt-decode";
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
    balance: 0,
  });
  const [upAbonement, setUpAbonement] = useState({});
  const [schedules, setSchedules] = useState({});
  const [serviceTypes, setServiceTypes] = useState([]);
  const addServiceType = (serviceType) =>
    setServiceTypes([...serviceTypes, serviceType]);
  const removeServiceType = (removeID) =>
    setServiceTypes(serviceTypes.filter(({ Id }) => Id !== removeID));
  const [typeTrainings, setTypeTrainings] = useState([]);

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
            path="/"
            element={
              <>
                <Profile user={user} setUser={setUser} />
              </>
            }
          ></Route>

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
