import axios from "axios";
import { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { useStore } from "../../App";

const JoinTimeZone = ({
  joinTimezoneModal,
  finishJoinTimezone,
  selectedTimezone,
  setSelectedTimezone,
  finishButtonName,
}) => {
  const [timezones, setTimezones] = useState([]);

  console.log(timezones);

  const { HTTP } = useStore();

  const getTimezones = async () => {
    await axios
      .get(`${HTTP}/timezones`)
      .then((res) => {
        if (res.status >= 200 && res.status <= 226) {
          setTimezones(res.data);
          console.log(res.data);
        }
      })
      .catch(console.error);
  };

  const selectTimezone = (id) => {
    setSelectedTimezone(id);
  };

  useEffect(() => {
    getTimezones();
  }, []);

  return (
    <Modal
      show={joinTimezoneModal}
      size="lg"
      className="bpg-arial-normal"
      backdrop="static"
    >
      <Modal.Header className="border-0">
        <Modal.Title>სამუშაო დროის გრაფიკი</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {timezones.map((tz, i) => {
          const { timezone_plan } = tz;
          return (
            <Accordion key={i} className="mt-2">
              <Accordion.Item eventKey={i}>
                <Col className="d-flex align-items-center px-2">
                  <Form.Check
                    checked={selectedTimezone === tz.Id}
                    onChange={() => selectTimezone(tz.Id)}
                  />
                  <Accordion.Header className="col">
                    {tz.groupName}
                  </Accordion.Header>
                </Col>
                <Accordion.Body>
                  {timezone_plan.map((tzp, j) => {
                    const { weekDays } = tzp;
                    return (
                      <Col
                        key={j}
                        className="border border-dark-subtle rounded-2 p-2 mt-2"
                      >
                        <Col className="ms-2">
                          <i>დღიური სამუშაო საათობრივი გეგმა {j + 1}</i>
                        </Col>
                        <Col className="d-flex flex-wrap gap-2 p-2 border rounded-2">
                          {weekDays.map((wd) => {
                            return (
                              <Col className="col-auto px-2 bg-secondary text-white rounded-3">
                                {wd.dayName}
                              </Col>
                            );
                          })}
                        </Col>
                        <Col className="p-2 border rounded-2 mt-2">
                          <Col className="d-flex gap-2 bpg-arial">
                            <Col className="col-auto">
                              <InputGroup>
                                <InputGroup.Text className="rounded-start-1">
                                  დაწყება
                                </InputGroup.Text>
                                <InputGroup.Text className="bg-white">
                                  {tzp.startTime}
                                </InputGroup.Text>
                              </InputGroup>
                            </Col>
                            <Col className="col-auto">
                              <InputGroup>
                                <InputGroup.Text>დასრულება</InputGroup.Text>
                                <InputGroup.Text className="bg-white rounded-end-1">
                                  {tzp.endTime}
                                </InputGroup.Text>
                              </InputGroup>
                            </Col>
                          </Col>
                        </Col>
                        <Col className="p-2 border rounded-2 mt-2">
                          <Col className="ms-2">
                            <small className="d-flex">
                              <i>შესვენებები</i>
                              <span className="ms-auto me-2 px-2 bg-secondary-subtle rounded-3">
                                {tzp.breakAnytime === 1
                                  ? "არა ფიქსირებული"
                                  : "ფიქსირებული"}
                              </span>
                            </small>
                          </Col>
                          <Col className="mt-2">
                            {tzp.breakTimes?.map((bt, k) => {
                              return (
                                <InputGroup className="mt-2">
                                  <InputGroup.Text>{k + 1}</InputGroup.Text>
                                  <InputGroup.Text>
                                    {bt.startTime}
                                  </InputGroup.Text>
                                  <InputGroup.Text>
                                    {bt.endTime}
                                  </InputGroup.Text>
                                </InputGroup>
                              );
                            })}
                          </Col>
                        </Col>
                      </Col>
                    );
                  })}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          );
        })}
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="success" onClick={finishJoinTimezone}>
          {finishButtonName}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JoinTimeZone;
