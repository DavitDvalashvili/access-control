import { Col } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { useEffect, useState } from "react";
import axios from "axios";
const Layout = () => {
  const [user, setUser] = useState(null);
  const url = process.env.REACT_APP_LOCAL_IP;
  console.log(url);

  const checkUser = async () => {
    await axios
      .get(`${url}:5000/checkuser`)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.loggedIn) setUser(true);
          else setUser(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    checkUser();
  });

  if (user === false) return <Navigate to={"/login"} />;
  if (user === true) {
    return (
      <Col className="d-flex">
        <Navigation />
        <Outlet />
      </Col>
    );
  }
};
export default Layout;
