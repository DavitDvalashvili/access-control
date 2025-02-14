import {
  Col,
  Form,
  InputGroup,
  Button,
  Accordion,
  Dropdown,
} from "react-bootstrap";
import { MdOutlineDateRange } from "react-icons/md";
import { useStore } from "../App";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { MdDelete } from "react-icons/md";

export const AddAbsenceDays = ({ holder, setMessage }) => {
  const [absenceDays, setAbsenceDays] = useState([]);
  const [absenceReasons, setAbsenceReasons] = useState([]);
  const [absenceData, setAbsenceData] = useState({
    absenceReasonId: "",
    absenceReasonName: "",
    startDate: "",
    endDate: "",
    cardUId: "",
  });

  const { HTTP } = useStore();

  const getAbsenceReason = async () => {
    await axios
      .get(`${HTTP}/getAbsenceReasons`)
      .then((res) => {
        if (res.status == 200) {
          setAbsenceReasons([...res.data]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAbsenceReason();
  }, []);

  const addAbsenceDate = async () => {
    await axios
      .post(`${HTTP}/addAbsenceDate`, absenceData)
      .then((res) => {
        if (res.status == 200) {
          setAbsenceDays([
            ...absenceDays,
            {
              ...absenceData,
              arID: String(Date.now()) + Math.floor(Math.random() * 10000),
            },
          ]);
          setMessage(res.data);
          setAbsenceData({
            absenceReasonId: "",
            absenceReasonName: "",
            startDate: "",
            endDate: "",
            cardUId: "",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteAbsenceDate = async (day) => {
    await axios
      .delete(`${HTTP}/deleteAbsenceDays/${day.arID}`)
      .then((res) => {
        if (res.data.status == "success") {
          setAbsenceDays((days) =>
            absenceDays.filter((d) => d.arID !== day.id)
          );
        }
        console.log(res.data);
        setMessage(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAbsenceDays = async () => {
    await axios
      .get(`${HTTP}/getAbsenceDays/${holder.CardUID}`)
      .then((res) => {
        if (res.status == 200) {
          setAbsenceDays(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setAbsenceData({ ...absenceData, cardUId: holder.CardUID });
  }, [holder, absenceDays]);

  useEffect(() => {
    getAbsenceDays();
  }, [holder, absenceDays]);

  return (
    <>
      <Accordion className="mt-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>დასვენების და უქმე დღეები</Accordion.Header>
          <Accordion.Body className="bpg-arial-normal ">
            <Col className="mb-2">
              {absenceDays.map((day) => (
                <Col className="d-flex align-items-center gap-2 fw-normal fs-6 cursor-pointer">
                  <MdDelete
                    className="text-danger "
                    onClick={() => deleteAbsenceDate(day)}
                    style={{ cursor: "pointer" }}
                  />
                  <span>{day.startDate}</span>
                  <span>{day.endDate}</span>
                  <span className="ml-4">{day.absenceReasonName}</span>
                </Col>
              ))}
            </Col>
            <Dropdown autoClose={false}>
              <Dropdown.Toggle
                variant="light"
                className="rounded-1 col-12 shadow-none"
              >
                დასვენების/გაცდენის მიზეზი
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {absenceReasons.map((reason, id) => {
                  return (
                    <Dropdown.Item
                      key={id}
                      as={Button}
                      className={`${
                        absenceData.absenceReasonId ==
                        reason.ConditionalNotationID
                          ? "bg-primary"
                          : "bg-primary-light"
                      }`}
                      onClick={() => {
                        setAbsenceData({
                          ...absenceData,
                          absenceReasonId: reason.ConditionalNotationID,
                          absenceReasonName: reason.ConditionalNotationName,
                        });
                      }}
                    >
                      {reason.ConditionalNotationName}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
            <Col className="d-flex gap-5">
              <Col>
                <Form.Group className="col">
                  <Form.Label className="m-1">საწყისი თარიღი</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="rounded-0">
                      <MdOutlineDateRange />
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      value={absenceData.startDate}
                      className="rounded-0 shadow-none"
                      onChange={(e) => {
                        setAbsenceData({
                          ...absenceData,
                          startDate: e.target.value,
                        });
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="col">
                  <Form.Label className="m-1">საბოლოო თარიღი</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="rounded-0">
                      <MdOutlineDateRange />
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      value={absenceData.endDate}
                      className="rounded-0 shadow-none"
                      onChange={(e) => {
                        setAbsenceData({
                          ...absenceData,
                          endDate: e.target.value,
                        });
                      }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Col>
            <Button
              type="submit"
              variant="dark"
              className="rounded-0 px-5 py-2 mt-3 fs-5"
              onClick={() => addAbsenceDate()}
            >
              დამატება
            </Button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
