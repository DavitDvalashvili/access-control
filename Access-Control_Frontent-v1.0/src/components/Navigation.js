import axios from "axios";
import {
  Button,
  Col,
  Container,
  Nav,
  Navbar,
  Offcanvas,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { useState } from "react";
import { IoIosLogOut } from "react-icons/io";

const Navigation = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_LOCAL_IP;

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const logOutUser = async () => {
    await axios
      .post(`${url}:5000/logout`)
      .then((res) => {
        if (res.status === 200) {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Col
      className="d-flex flex-column align-items-start shadow col-auto"
      style={{ height: "100vh" }}
    >
      <Col className="col-auto d-flex flex-column" style={{ flex: 1 }}>
        <Button
          className="bg-light border-0 fs-2 pt-0 pb-2 px-3 text-dark border-0 border-1 border-bottom border-secondary rounded-0"
          onClick={handleShow}
        >
          <AiOutlineMenuUnfold />
        </Button>
      </Col>
      <Col className="d-flex flex-column col-12 p-2">
        <Col
          className="d-flex justify-content-center align-items-center fs-2 text-danger"
          style={{ cursor: "pointer" }}
          onClick={logOutUser}
        >
          <IoIosLogOut />
        </Col>
      </Col>
      <Offcanvas show={show} onHide={handleClose} className="bpg-arial">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>ნავიგაცია</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body
          className="d-flex flex-column"
          style={{ height: "100%" }}
        >
          <Navbar bg="light" className="flex-column" style={{ flex: 1 }}>
            <Nav
              className="me-auto bpg-arial d-flex flex-column"
              style={{ flex: 1 }}
            >
              <Nav.Link as={Link} to={"/"}>
                მთავარი
              </Nav.Link>
              <Nav.Link as={Link} to={"/addcardholder"}>
                ბარათის მფლობელი
              </Nav.Link>
              <Nav.Link as={Link} to={"/editholder"}>
                მფლობელის რედაქტირება
              </Nav.Link>
              <Nav.Link as={Link} to={"/realtimeevent"}>
                რეალ-თაიმ მოვლენები
              </Nav.Link>
              <Nav.Link as={Link} to={"/eventmonitor"}>
                მოვლენების მონიტორი
              </Nav.Link>
              <Nav.Link as={Link} to={"/reports"}>
                ანგარიში
              </Nav.Link>
              <Nav.Link as={Link} to={"/report"}>
                რეპორტი
              </Nav.Link>
              <Nav.Link as={Link} to={"/currentevent"}>
                დღევანდელი მოვლენები
              </Nav.Link>
              <Nav.Link as={Link} to={"/worktimeaccounting"}>
                სამუშაო დროის აღრიცხვა
              </Nav.Link>
              <Nav.Link as={Link} to={"/worktimeplan"}>
                სამუშაო დროის გეგმა
              </Nav.Link>
              <Nav.Link as={Link} to={"/changeip"}>
                IP მისამართის ცვლილება
              </Nav.Link>
              <Nav.Link as={Link} to={"/errorlogs"}>
                Error Logs
              </Nav.Link>
              <Nav.Link as={Link} to={"/settings"}>
                პარამეტრები
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto bpg-arial" style={{ flex: 0 }}>
              <Nav.Link as={Link} className="text-danger" onClick={logOutUser}>
                გასვლა
              </Nav.Link>
            </Nav>
          </Navbar>
        </Offcanvas.Body>
      </Offcanvas>
    </Col>
  );
};
export default Navigation;
