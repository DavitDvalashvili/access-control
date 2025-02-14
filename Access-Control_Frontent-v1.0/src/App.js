import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import "bpg-arial-caps/css/bpg-arial-caps.min.css";
import "bpg-arial/css/bpg-arial.min.css";
import Layout from "./components/Layout";
import AddCardHolder from "./components/AddCardHolder";
import Reports from "./components/Reports";
import EditCardHolder from "./components/EditCardHolder";
import EventMonitor from "./components/EventMonitor";
import CurrentEvent from "./components/CurrentEvent";
import Registration from "./components/Authentication/Autorization";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import UserRouter from "./components/ProtectedRoute/UserRouter.js";
import WorkTimeAccounting from "./components/WorkTimeAccounting";
import Chat from "./components/Chat";
import { create } from "zustand";
import WorkTimePlan from "./components/WorkTimePlan";
import ChangeIP from "./components/ChangeIP";
import RealTimeEvent from "./components/RealTimeEvent";
import ErrorLogs from "./components/ErrorLogs.js";
import DashboardLayout from "./components/Dashboard/DashboardLayout.js";
import TestReport from "./components/TestReport.js";
import { Settings } from "./components/Settings.js";

const url = process.env.REACT_APP_LOCAL_IP;

export const useStore = create((set) => ({
  HTTP: process.env.REACT_APP_HTTP,
  WS: process.env.REACT_APP_WS,
  weekDays: [],
  timeZones: [],
  realTimeEvents: [],
  setRealTimeEvents: (data) => set({ realTimeEvents: data }),
  getData: async () => {
    await axios.get(`${url}:5000/nessesarydata`).then((res) => {
      if (res.status === 200) {
        set({ weekDays: res.data.weekDays, timeZones: res.data.timeZones });
      }
    });
  },
  setTimeZone: (data) => set({ timeZones: data }),
}));

function App() {
  axios.defaults.withCredentials = true;
  const { getData } = useStore();

  const connectSerial = async () => {
    await axios
      .get(`${url}:5000/serialconnection`)
      .then((res) => {
        if (res.status >= 200 && res.status <= 226) {
          console.log(res.data);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    getData();
    // connectSerial();
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardLayout />} />
          <Route path="/addcardholder" element={<AddCardHolder />} />
          <Route path="/editholder" element={<EditCardHolder />} />
          <Route path="/realtimeevent" element={<RealTimeEvent />} />
          <Route path="/eventmonitor" element={<EventMonitor />} />
          <Route path="/reports" element={<Reports />}>
            <Route path=":entrance" element={<Reports />} />
          </Route>
          <Route path="/testReport" element={<TestReport />} />
          <Route path="/currentevent" element={<CurrentEvent />} />
          <Route path="/worktimeaccounting" element={<WorkTimeAccounting />} />
          <Route path="/worktimeplan" element={<WorkTimePlan />} />
          <Route path="/changeip" element={<ChangeIP />} />
          <Route path="/errorlogs" element={<ErrorLogs />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route element={<UserRouter />}>
          <Route path="/login" element={<Registration />} />
        </Route>
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
