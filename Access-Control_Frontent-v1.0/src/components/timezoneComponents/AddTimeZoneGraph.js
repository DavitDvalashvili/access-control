import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { useStore } from "../../App";
import axios from "axios";

import { HiOutlinePlusSm, HiOutlineMinusSm } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";

const AddTimeZoneGraph = ({ timezoneModal, hideTimezone }) => {
  const [groupName, setGroupName] = useState("");
  const [gnEditable, setGnEditable] = useState(false);
  const changeGNValue = (e) => setGroupName(e.target.value);
  const enableGNEditable = () => setGnEditable(true);
  const disableGNEditable = () => setGnEditable(false);
  const changeGNBorderColor = () => {
    if (groupName.length === 0) {
      return "border-danger-subtle";
    } else {
      if (gnEditable) return "border-success-subtle";
      else return "border-primary-subtle";
    }
  };

  const [timePlan, setTimePlan] = useState([
    {
      startTimeH: "0",
      startTimeM: "0",
      endTimeH: "0",
      endTimeM: "0",
      weekDays: [],
      breakAnytime: false,
      breakTimes: [],
      shrink: false,
    },
  ]);

  const [weekdays, setWeekDays] = useState([]);

  const { HTTP } = useStore();

  const getWeekDays = async () => {
    axios
      .get(`${HTTP}/weekdays`)
      .then((res) => {
        if (res.status >= 200 && res.status <= 226) {
          setWeekDays(res.data);
        }
      })
      .catch(console.error);
  };

  console.log(weekdays);

  const registerTimezone = async () => {
    const _timePlan = timePlan.map((x) => {
      return {
        ...x,
        startTimeH: x.startTimeH.padStart(2, "0"),
        startTimeM: x.startTimeM.padStart(2, "0"),
        endTimeH: x.endTimeH.padStart(2, "0"),
        endTimeM: x.endTimeM.padStart(2, "0"),
        breakTimes: x.breakAnytime
          ? [
              {
                startTime: `${x.breakTimes[0].startTimeH.padStart(
                  2,
                  "0"
                )}:${x.breakTimes[0].startTimeM.padStart(2, "0")}:00`,
                endTime: `${x.breakTimes[0].endTimeH.padStart(
                  2,
                  "0"
                )}:${x.breakTimes[0].endTimeM.padStart(2, "0")}:00`,
              },
            ]
          : x.breakTimes.map((y) => {
              return {
                startTime: `${y.startTimeH.padStart(
                  2,
                  "0"
                )}:${y.startTimeM.padStart(2, "0")}:00`,
                endTime: `${y.endTimeH.padStart(2, "0")}:${y.endTimeM.padStart(
                  2,
                  "0"
                )}:00`,
              };
            }),
      };
    });
    await axios
      .post(`${HTTP}/timezone`, { groupName, timePlan: _timePlan })
      .then((res) => {
        if (res.status >= 200 && res.status <= 226) {
          console.log(res.data);
        }
      })
      .catch(console.error);
  };

  const nextInput = (e) => {
    const inputCollection = document.getElementsByTagName("input");
    for (let i in inputCollection) {
      if (inputCollection.item(i) === e.target) {
        const nextInput = inputCollection.item(Number(i) + 1);
        if (nextInput?.name?.endsWith("H") || nextInput?.name?.endsWith("M"))
          nextInput.focus();
      }
    }
  };

  const previousInput = (e) => {
    const inputCollection = document.getElementsByTagName("input");
    for (let i in inputCollection) {
      if (inputCollection.item(i) === e.target) {
        const nextInput = inputCollection.item(Number(i) - 1);
        if (nextInput?.name?.endsWith("H") || nextInput?.name?.endsWith("M"))
          nextInput.focus();
      }
    }
  };

  const changeTimePlanValues = (e, idx) => {
    const _timePlan = [...timePlan];
    const value = registerTime(e);
    _timePlan[idx][e.target.name] = value;
    setTimePlan(_timePlan);

    if (!value.startsWith("0") && value.length === 2) nextInput(e);
    else if (value === "00") nextInput(e);
    else if (value.length < 1) previousInput(e);
  };

  const registerTime = (e) => {
    let t = "";
    // console.log(e.target.value.length);
    if (e.target.name.endsWith("H")) {
      if (Number(e.target.value) > 23) {
        t = "00";
      } else {
        t = e.target.value;
      }
      t = e.target.value.length > 2 ? e.target.value.slice(1) : e.target.value;
      if (Number(t) > 2) nextInput(e);
      return Number(t) < 24
        ? t.padStart(1, "0")
        : Number(t) < 10
        ? t.padStart(2, "0")
        : "00";
    } else {
      if (Number(e.target.value) > 59) {
        t = "00";
      } else {
        t = e.target.value;
      }
      if (Number(t) > 6) nextInput(e);
      t = e.target.value.length > 2 ? e.target.value.slice(1) : e.target.value;
      return Number(t) < 60
        ? t.padStart(1, "0")
        : Number(t) < 10
        ? t.padStart(2, "0")
        : "00";
    }
  };

  const restrictKeys = (e = new KeyboardEvent()) => {
    e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
    if (
      e.key.toLowerCase() === "backspace" &&
      (e.target.value === "" || e.target.value === "0")
    )
      previousInput(e);
    if (e.key.toLowerCase() === " ") nextInput(e);
    if (
      !e.key
        .toLowerCase()
        .match(
          /[0-9]|backspace|arrowleft|arrowtop|arrowright|arrowdown|tab|a|z/
        ) &&
      !e.ctrlKey
    )
      e.preventDefault();
  };

  const addTimePlan = () => {
    setTimePlan((tp) => [
      ...tp,
      {
        startTimeH: "0",
        startTimeM: "0",
        endTimeH: "0",
        endTimeM: "0",
        breakAnytime: false,
        weekDays: [],
        breakTimes: [],
        shrink: false,
      },
    ]);
  };

  const removeTimePlan = (tpIdx) => {
    setTimePlan((timePlan) => timePlan.filter((_, i) => i !== tpIdx));
  };

  const bindWeekDay = (wd, i) => {
    const _timePlan = [...timePlan];
    const isWDExist = _timePlan[i].weekDays.some((x) => x.Id === wd.Id);
    if (isWDExist)
      _timePlan[i].weekDays = _timePlan[i].weekDays.filter(
        (x) => x.Id !== wd.Id
      );
    else _timePlan[i].weekDays.push(wd);
    setTimePlan(_timePlan);
  };

  const shrinkTimePlan = (tpIdx) => {
    const _timePlan = [...timePlan];
    _timePlan[tpIdx].shrink = !_timePlan[tpIdx].shrink;
    setTimePlan(_timePlan);
  };

  // breakTimes
  const addBreakTime = (tpIdx) => {
    const _timePlan = [...timePlan];
    _timePlan[tpIdx]["breakTimes"].push({
      startTimeH: "0",
      startTimeM: "0",
      endTimeH: "0",
      endTimeM: "0",
    });
    setTimePlan(_timePlan);
  };

  const removeBreakTime = (tpIdx, btIdx) => {
    const _timePlan = [...timePlan];
    _timePlan[tpIdx].breakTimes = _timePlan[tpIdx].breakTimes.filter(
      (_, i) => i !== btIdx
    );
    setTimePlan(_timePlan);
  };

  const switchBreakAnyTime = (e, tpIdx) => {
    const _timePlan = [...timePlan];
    _timePlan[tpIdx].breakAnytime = e.target.checked;
    setTimePlan(_timePlan);
  };

  const changeBreakTimeValues = (e, tpIdx, btIdx) => {
    const _timePlan = [...timePlan];
    const value = registerTime(e);
    _timePlan[tpIdx]["breakTimes"][btIdx][e.target.name] = value;
    setTimePlan(_timePlan);

    if (!value.startsWith("0") && value.length === 2) nextInput(e);
    else if (value === "00") nextInput(e);
    else if (value.length < 1) previousInput(e);
  };

  useEffect(() => {
    getWeekDays();
  }, []);

  const weekdaysCount = timePlan
    .map((x) => x.weekDays.length)
    .reduce((a, b) => a + b, 0);
  const canAddNewTimePlan =
    (weekdaysCount < 7 && timePlan.some((x) => x.weekDays.length < 1)) ||
    (weekdaysCount === 7 && timePlan.every((x) => x.weekDays.length > 0));
  useEffect(() => {
    if (weekdaysCount === 7 && timePlan.some((x) => x.weekDays.length === 0)) {
      console.log(1);
      setTimePlan(timePlan.filter((x) => x.weekDays.length > 0));
    }
  }, [timePlan]);

  return (
    <Modal
      show={timezoneModal}
      backdrop="static"
      size="md"
      className="bpg-arial-normal"
    >
      <Modal.Header className="border-0">
        <Modal.Title>სამუშაო გრაფიკის დამატება</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Col>
          <Col>
            <Form.Control
              type="text"
              className={`border border-2 p-2 shadow-none rounded-2 ${changeGNBorderColor()}`}
              placeholder="გრაფიკის სახელი"
              onBlur={disableGNEditable}
              onClick={enableGNEditable}
              value={groupName}
              onChange={changeGNValue}
            />
          </Col>
          <Col>
            {timePlan.map((p, i) => {
              const takenIds = [];
              const wdIds = weekdays.map((x) => x.Id);
              const taken = timePlan.filter(
                (x, k) =>
                  x.weekDays.some((y) => wdIds.includes(y.Id)) && i !== k
              );
              taken.map((x) => x.weekDays.map((y) => takenIds.push(y.Id)));
              return (
                <Col
                  key={i}
                  style={{ height: p.shrink ? 33 : "auto" }}
                  className={`border ${
                    p.shrink ? "overflow-hidden" : ""
                  } border-dark-subtle p-2 pt-0 rounded-2 mt-2`}
                >
                  <Col className="">
                    <small className="py-1 text-dark-emphasis d-flex align-items-center">
                      <Col
                        className={`col-auto text-dark fs-6`}
                        style={{ cursor: "pointer" }}
                        onClick={() => shrinkTimePlan(i)}
                      >
                        {p.shrink ? <HiOutlinePlusSm /> : <HiOutlineMinusSm />}
                      </Col>
                      <i
                        className="ms-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => shrinkTimePlan(i)}
                      >
                        დღიური სამუშაო საათობრივი გეგმა {i + 1}
                      </i>
                      {i > 0 && (
                        <FaTrash
                          className="me-2 ms-auto text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => removeTimePlan(i)}
                        />
                      )}
                    </small>
                    <Col className="d-flex gap-1">
                      <Col className="col-8">
                        <InputGroup>
                          <Form.Control
                            autoComplete="off"
                            auto
                            className="rounded-start-1 text-center"
                            type="text"
                            placeholder="00"
                            name="startTimeH"
                            value={p.startTimeH}
                            onKeyDown={restrictKeys}
                            onChange={(e) => changeTimePlanValues(e, i)}
                          />
                          <InputGroup.Text className="px-1">:</InputGroup.Text>
                          <Form.Control
                            autoComplete="off"
                            auto
                            className="text-center"
                            type="text"
                            placeholder="00"
                            name="startTimeM"
                            value={p.startTimeM}
                            onKeyDown={restrictKeys}
                            onChange={(e) => changeTimePlanValues(e, i)}
                          />
                          <InputGroup.Text>-</InputGroup.Text>
                          <Form.Control
                            autoComplete="off"
                            auto
                            className="text-center"
                            type="text"
                            placeholder="00"
                            name="endTimeH"
                            value={p.endTimeH}
                            onKeyDown={restrictKeys}
                            onChange={(e) => changeTimePlanValues(e, i)}
                          />
                          <InputGroup.Text className="px-1">:</InputGroup.Text>
                          <Form.Control
                            autoComplete="off"
                            auto
                            className="text-center rounded-end-1"
                            type="text"
                            placeholder="00"
                            value={p.endTimeM}
                            name="endTimeM"
                            onKeyDown={restrictKeys}
                            onChange={(e) => changeTimePlanValues(e, i)}
                          />
                        </InputGroup>
                      </Col>
                      <Col>
                        <Dropdown autoClose={false}>
                          <Dropdown.Toggle
                            variant="light"
                            className="rounded-1 col-12 shadow-none"
                          >
                            დღეები
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {weekdays.map((day, j) => {
                              const includesDay = p.weekDays.some(
                                (x) => x.Id === day.Id
                              );
                              return (
                                <Dropdown.Item
                                  key={j}
                                  as={Button}
                                  disabled={takenIds.includes(day.Id)}
                                  className={`bg-${
                                    includesDay ? "primary-subtle" : "light"
                                  }`}
                                  onClick={() => bindWeekDay(day, i)}
                                >
                                  {day.dayName}
                                </Dropdown.Item>
                              );
                            })}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Col>
                    <Row className="gap-2 mt-2 px-3">
                      {p.weekDays
                        .sort((a, b) => a.dayNumber - b.dayNumber)
                        .map((wd) => {
                          return (
                            <Col
                              className="col-auto px-1 rounded-3 bg-secondary text-white"
                              style={{ fontSize: ".7rem" }}
                            >
                              {wd.dayName}
                            </Col>
                          );
                        })}
                    </Row>
                    <Col className="p-2 pt-0 border rounded-1 mt-2">
                      <small
                        className="py-0 text-secondary ms-1 mt-1 d-flex justify-content-between"
                        style={{ fontSize: ".75rem" }}
                      >
                        <i>შესვენებები</i>
                        <Form.Check
                          type="switch"
                          label="არა ფიქსირებული"
                          id={`nonfixedbreak-${i}`}
                          checked={p.breakAnytime}
                          onChange={(e) => switchBreakAnyTime(e, i)}
                          reverse
                        />
                      </small>
                      {p.breakTimes.map((bt, j) => {
                        return (
                          <InputGroup
                            key={j}
                            className={`${j > 0 ? "mt-2" : "mt-0"}`}
                          >
                            <InputGroup.Text className="rounded-start-1 px-2">
                              <b>{j + 1}</b>
                            </InputGroup.Text>
                            <Form.Control
                              disabled={j > 0 && p.breakAnytime}
                              size="sm"
                              className="text-center"
                              type="text"
                              placeholder="00"
                              name="startTimeH"
                              value={bt.startTimeH}
                              onKeyDown={restrictKeys}
                              onChange={(e) => changeBreakTimeValues(e, i, j)}
                            />
                            <InputGroup.Text className="px-1">
                              :
                            </InputGroup.Text>
                            <Form.Control
                              disabled={j > 0 && p.breakAnytime}
                              size="sm"
                              className="text-center"
                              type="text"
                              placeholder="00"
                              name="startTimeM"
                              value={bt.startTimeM}
                              onKeyDown={restrictKeys}
                              onChange={(e) => changeBreakTimeValues(e, i, j)}
                            />
                            <InputGroup.Text>-</InputGroup.Text>
                            <Form.Control
                              disabled={j > 0 && p.breakAnytime}
                              size="sm"
                              className="text-center"
                              type="text"
                              placeholder="00"
                              name="endTimeH"
                              value={bt.endTimeH}
                              onKeyDown={restrictKeys}
                              onChange={(e) => changeBreakTimeValues(e, i, j)}
                            />
                            <InputGroup.Text className="px-1">
                              :
                            </InputGroup.Text>
                            <Form.Control
                              disabled={j > 0 && p.breakAnytime}
                              size="sm"
                              className="text-center"
                              type="text"
                              placeholder="00"
                              value={bt.endTimeM}
                              name="endTimeM"
                              onKeyDown={restrictKeys}
                              onChange={(e) => changeBreakTimeValues(e, i, j)}
                            />
                            <Button
                              variant="danger"
                              className="rounded-end-1"
                              onClick={() => removeBreakTime(i, j)}
                            >
                              <FaTrash />
                            </Button>
                          </InputGroup>
                        );
                      })}
                    </Col>
                    <Button
                      variant="success"
                      className="mt-2 py-0"
                      size="sm"
                      style={{ fontSize: ".7rem" }}
                      onClick={() => addBreakTime(i)}
                    >
                      შესვენებები +
                    </Button>
                  </Col>
                </Col>
              );
            })}
            <Button
              disabled={canAddNewTimePlan}
              variant="success"
              className="mt-2 col-12"
              size="sm"
              onClick={addTimePlan}
            >
              +
            </Button>
          </Col>
        </Col>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          variant="success"
          className="rounded-1"
          onClick={registerTimezone}
        >
          დამატება
        </Button>
        <Button variant="danger" className="rounded-1" onClick={hideTimezone}>
          გაუქმება
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTimeZoneGraph;
