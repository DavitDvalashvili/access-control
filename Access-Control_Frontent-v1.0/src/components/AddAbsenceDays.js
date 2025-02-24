import {
  Col,
  Form,
  InputGroup,
  Button,
  Accordion,
  Dropdown,
} from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { useStore } from "../App";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { MdDelete } from "react-icons/md";

export const AddAbsenceDays = ({ holder, setMessage }) => {
  const [absenceReasons, setAbsenceReasons] = useState([]);
  const [updateMode, setUpdateMode] = useState(false);
  const [absenceData, setAbsenceData] = useState({
    ConditionalNotationID: "",
    ConditionalNotationName: "",
    AbsenceReasonId: "",
    startDate: "",
    endDate: "",
    cardUId: "",
  });

  const [absenceDays, setAbsenceDays] = useState([]);

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

  useEffect(() => {
    setAbsenceData({ ...absenceData, cardUId: holder.CardUID });
  }, [holder]);

  useEffect(() => {
    console.log(absenceDays);
  }, [absenceDays]);

  const addAbsenceDate = async () => {
    await axios
      .post(`${HTTP}/addAbsenceDate`, absenceData)
      .then((res) => {
        if (res.data.status === "success") {
          setAbsenceDays([
            ...absenceDays,
            {
              ...absenceData,
              AbsenceReasonId: res.data.absenceReasonId,
            },
          ]);
        }
        setAbsenceData({
          ...absenceData,
          ConditionalNotationID: "",
          ConditionalNotationName: "",
          AbsenceReasonId: "",
          startDate: "",
          endDate: "",
        });

        setMessage(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editAbsenceDays = async () => {
    await axios
      .post(
        `${HTTP}/editAbsenceDays/${absenceData.AbsenceReasonId}`,
        absenceData
      )
      .then((res) => {
        if (res.data.status == "success") {
          console.log(res.data);
          setAbsenceDays([
            ...absenceDays.filter(
              (day) => day.AbsenceReasonId !== absenceData.AbsenceReasonId
            ),
            {
              ...absenceData,
            },
          ]);
        }
        setAbsenceData({
          ...absenceData,
          ConditionalNotationID: "",
          ConditionalNotationName: "",
          AbsenceReasonId: "",
          startDate: "",
          endDate: "",
        });
        setUpdateMode(!updateMode);
        setMessage(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteAbsenceDate = async (day) => {
    await axios
      .delete(`${HTTP}/deleteAbsenceDays/${day.AbsenceReasonId}`)
      .then((res) => {
        if (res.data.status == "success") {
          setAbsenceDays((days) =>
            absenceDays.filter((d) => d.AbsenceReasonId !== day.AbsenceReasonId)
          );
        }
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
    getAbsenceDays();
  }, [holder]);

  return (
    <>
      <Accordion className="mt-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>დასვენების და უქმე დღეები</Accordion.Header>
          <Accordion.Body className="bpg-arial-normal ">
            <Col style={{ fontSize: "15px" }}>
              {absenceDays.map((day) => (
                <Col
                  className="d-flex align-items-center gap-3 fw-normal cursor-pointer"
                  key={day.absenceReasonId}
                >
                  {" "}
                  <div
                    className="d-flex gap-2 justify-content-center"
                    style={{
                      //width: "100px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    <MdDelete
                      className="text-danger "
                      onClick={() => deleteAbsenceDate(day)}
                      style={{ cursor: "pointer" }}
                    />
                    <FaEdit
                      className="text-success"
                      onClick={() => {
                        setUpdateMode(true);
                        console.log(day);
                        setAbsenceData({
                          ...day,
                        });
                      }}
                    />
                  </div>
                  <span>{day.startDate}</span>
                  <span>{day.endDate}</span>
                  <span className="ml-4">{day.ConditionalNotationName}</span>
                </Col>
              ))}
            </Col>
            <Dropdown autoClose={false}>
              <Dropdown.Toggle
                variant="light"
                className="rounded-1 col-12 shadow-none mt-3"
              >
                {absenceData.ConditionalNotationName
                  ? absenceData.ConditionalNotationName
                  : "დასვენების/გაცდენის მიზეზი"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {absenceReasons.map((reason, id) => {
                  return (
                    <Dropdown.Item
                      key={id}
                      as={Button}
                      className={`${
                        absenceData.ConditionalNotationID ==
                        reason.ConditionalNotationID
                          ? "bg-primary"
                          : "bg-primary-light"
                      }`}
                      onClick={() => {
                        setAbsenceData({
                          ...absenceData,
                          ConditionalNotationID: reason.ConditionalNotationID,
                          ConditionalNotationName:
                            reason.ConditionalNotationName,
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
            <Col className="d-flex justify-content-end">
              {updateMode ? (
                <Button
                  type="submit"
                  variant="success"
                  className="rounded-1 px-2 py-2 mt-3 fs-8"
                  onClick={() => editAbsenceDays()}
                >
                  განახლება
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="success"
                  className="rounded-1 px-2 py-2 mt-3 fs-8"
                  onClick={() => {
                    if (absenceData.ConditionalNotationID) {
                      addAbsenceDate();
                    }
                  }}
                >
                  დამატება
                </Button>
              )}
            </Col>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
