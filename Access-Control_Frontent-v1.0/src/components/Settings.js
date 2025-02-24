import {
  Container,
  Form,
  Col,
  InputGroup,
  Button,
  Row,
  Accordion,
} from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { TfiClose } from "react-icons/tfi";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "../App";

export const Settings = () => {
  const [message, setMessage] = useState({
    status: "",
    message: "",
  });
  const [update, setUpdate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [holiday, setHoliday] = useState({
    startDate: "",
    endDate: "",
    holydayName: "",
    holidayId: "",
  });

  const { HTTP } = useStore();

  const addHoliday = async () => {
    await axios
      .post(`${HTTP}/addHoliday`, holiday)
      .then((res) => {
        if (res.data.status == "success") {
          setHolidays([
            ...holidays,
            { ...holiday, holidayId: res.data.holidayId },
          ]);
        }
        setHoliday({
          startDate: "",
          endDate: "",
          holydayName: "",
          holidayId: "",
        });
        setMessage(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getHolidays = async () => {
    await axios
      .get(`${HTTP}/getHolidays`)
      .then((res) => {
        if (res.status == 200) {
          setHolidays(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteHoliday = async (holiday) => {
    await axios
      .delete(`${HTTP}/deleteHoliday/${holiday.holidayId}`)
      .then((res) => {
        if (res.data.status == "success") {
          setHolidays((days) =>
            holidays.filter((d) => d.holidayId !== holiday.holidayId)
          );
        }
        setMessage(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editHoliday = async () => {
    await axios
      .post(`${HTTP}/editHoliday/${holiday.holidayId}`, holiday)
      .then((res) => {
        if (res.data.status == "success") {
          setHolidays([
            ...holidays.filter((d) => d.holidayId !== holiday.holidayId),
            holiday,
          ]);
        }
        setHoliday({
          startDate: "",
          endDate: "",
          holydayName: "",
        });
        setMessage(res.data);
        setUpdate(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getHolidays();
  }, []);

  return (
    <Container className="mt-2">
      <Col
        className="bg-dark text-light col-xl-8 mx-auto py-3 px-4 mb-2 fs-5 bpg-arial d-flex align-items-center"
        style={{ letterSpacing: 1, fontWeight: 400 }}
      >
        სადღესასწაულო დღეების დამატება
      </Col>
      <Form
        className="bpg-arial pt-2 pb-4 px-5 col-xl-8 mx-auto shadow"
        onSubmit={(e) => e.preventDefault()}
      >
        <Col className="d-flex gap-5 mb-4">
          <Form.Group className="col">
            <Form.Label className="m-2" aria-required>
              სადღესასწაულო დღის დასახელება{" "}
              <span className="text-danger">*</span>
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="rounded-end-0">
                <LiaBirthdayCakeSolid />
              </InputGroup.Text>
              <Form.Control
                type="text"
                className="rounded-start-0 shadow-none"
                placeholder="სახელწოდება"
                value={holiday.holydayName}
                onChange={(e) =>
                  setHoliday({ ...holiday, holydayName: e.target.value })
                }
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col className="mb-5">
          <Row className="align-items-center">
            <Col className="d-flex justify-content-between align-items-center mb-2">
              <span className="fs-8">აირჩიე თარიღი</span>{" "}
              <div className="d-flex align-items-center  px-2 rounded ms-auto">
                <span className="me-2 fs-12">
                  {showEndDate ? "ერთდღიანი" : "მრავალდღიანი"}
                </span>
                <Form.Check
                  type="switch"
                  className="mt-0"
                  onChange={() => {
                    setShowEndDate(!showEndDate);
                  }}
                  checked={showEndDate}
                />
              </div>
            </Col>
          </Row>
          <Col className="d-flex gap-5">
            <Form.Group className="col">
              {showEndDate && <Form.Label>საწყისი </Form.Label>}
              <InputGroup>
                <InputGroup.Text className="rounded-end-0">
                  <MdOutlineDateRange />
                </InputGroup.Text>
                <Form.Control
                  type="date"
                  className="rounded-start-1 shadow-none"
                  value={holiday.startDate}
                  onChange={(e) => {
                    setHoliday((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                      endDate: !showEndDate ? e.target.value : prev.endDate,
                    }));
                  }}
                />
              </InputGroup>
            </Form.Group>
            {showEndDate && (
              <Form.Group className="col">
                <Form.Label>საბოლოო</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="rounded-end-0">
                    <MdOutlineDateRange />
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    className="rounded-start-1 shadow-none"
                    value={holiday.endDate}
                    onChange={(e) =>
                      setHoliday({
                        ...holiday,
                        endDate: e.target.value,
                      })
                    }
                  />
                </InputGroup>
              </Form.Group>
            )}
          </Col>
        </Col>
        <Col>
          {update ? (
            <Button
              type="submit"
              variant="dark"
              className="rounded-1 px-5 py-2 fs-5"
              onClick={editHoliday}
            >
              განახლება
            </Button>
          ) : (
            <Button
              type="submit"
              variant="dark"
              className="rounded-1 px-5 py-2 fs-5"
              onClick={addHoliday}
            >
              დამატება
            </Button>
          )}
        </Col>
        <Accordion className="mt-3 ">
          <Accordion.Item eventKey="0">
            <Accordion.Header className="fs-8">
              სადღესასწაულო დასვენების დღეები
            </Accordion.Header>
            <Accordion.Body className="bpg-arial-normal ">
              {holidays.length > 1 && (
                <Col className="d-flex align-items-center justify-content-start gap-4 fw-normal fs-12 mb-3">
                  <span className="d-flex flex-column align-items-center">
                    <span>წაშლა</span>
                    <span>რედაქტირება</span>
                  </span>
                  <span className="">საწყისი თარიღი</span>
                  <span className="">საბოლოო თარიღი</span>
                  <span className="">დასახელება</span>
                </Col>
              )}
              <Col className="mb-2">
                {holidays.map((holiday) => (
                  <Col
                    className="d-flex align-items-center justify-content-start gap-4 fw-normal fs-6 cursor-pointer mb-4 "
                    key={holiday.holidayId}
                  >
                    <div
                      className="d-flex gap-2 justify-content-center"
                      style={{ width: "117px", cursor: "pointer" }}
                    >
                      <MdDelete
                        className="text-danger"
                        onClick={() => deleteHoliday(holiday)}
                      />
                      <FaEdit
                        className="text-success"
                        onClick={() => {
                          if (holiday.startDate == holiday.endDate) {
                            setShowEndDate(false);
                            setHoliday({ ...holiday, endDate: "" });
                          } else {
                            setShowEndDate(true);
                            setHoliday(holiday);
                          }
                          setUpdate(true);
                        }}
                      />
                    </div>

                    <span className="text-center " style={{ width: "137px" }}>
                      {holiday.startDate}
                    </span>
                    <span className="text-center " style={{ width: "137px" }}>
                      {holiday.endDate}
                    </span>
                    <span
                      className="ml-4 text-center "
                      style={{ width: "137px" }}
                    >
                      {holiday.holydayName}
                    </span>
                  </Col>
                ))}
                {holidays.length < 1 && <span>დღეები დამატებული არ არის</span>}
              </Col>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Form>
      {message.status && (
        <Col
          className={`p-3 d-flex justify-content-between align-item-center mt-3 col-8 mx-auto rounded-3 bg-${
            message.status === "error" ? "danger" : "success"
          } text-light text-center bpg-arial`}
        >
          <Col className="mx-auto">{message.message}</Col>
          <Col
            className="ms-auto col-auto text-white"
            style={{ cursor: "pointer" }}
            onClick={() => setMessage({})}
          >
            <b>
              <TfiClose />
            </b>
          </Col>
        </Col>
      )}
    </Container>
  );
};
