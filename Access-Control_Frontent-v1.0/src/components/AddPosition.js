import {
  Form,
  Col,
  InputGroup,
  Button,
  Dropdown,
  Accordion,
} from "react-bootstrap";
import { AiFillCloseSquare } from "react-icons/ai";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { useStore } from "../App";

export const AddPosition = ({ setMessage, setCardHolder, cardHolder }) => {
  const [structureUnits, setStructureUnits] = useState([]);
  const [positions, setPositions] = useState([]);
  const [filteredPosition, setFilterPositions] = useState([]);
  const [hidePositionDropDown, setHidePositionDropDown] = useState(false);
  const [showStructureUnits, setShowStructureUnits] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [structureUnit, setStructureUnit] = useState({
    StructureUnitName: "",
    StructureUnitID: "",
  });
  const [showStructureInput, setShowStructureInput] = useState(false);
  const [positionData, setPositionData] = useState({
    positionName: "",
    StructureUnitID: "",
    StructureUnitName: "",
  });

  const { HTTP } = useStore();

  const getStructureUnit = async () => {
    await axios
      .get(`${HTTP}/getStructureUnit`)
      .then((res) => {
        if (res.status == 200) {
          setStructureUnits(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPositions = async () => {
    await axios
      .get(`${HTTP}/getPositions`)
      .then((res) => {
        if (res.status == 200) {
          setPositions(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addPosition = async () => {
    await axios
      .post(`${HTTP}/addPosition`, positionData)
      .then((res) => {
        if (res.data.status == "success") {
          setCardHolder({
            ...cardHolder,
            HolderPositionID: res.data.HolderPositionID,
          });
          setPositionData({
            positionName: "",
            StructureUnitID: "",
            StructureUnitName: "",
          });
          setHidePositionDropDown(!hidePositionDropDown);
        }
        setMessage(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addStructureUnit = async () => {
    await axios
      .post(`${HTTP}/addStructureInit`, structureUnit)
      .then((res) => {
        if (res.data.status == "success") {
          setStructureUnits([
            ...structureUnits,
            {
              ...structureUnit,
              StructureUnitID: res.data.StructureUnitID,
            },
          ]);
        }

        setStructureUnit({
          StructureUnitName: "",
          StructureUnitID: "",
        });
        setShowStructureInput(!structureUnit);
        setMessage(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editStructureUnit = async () => {
    await axios
      .post(`${HTTP}/editStructureInit`, structureUnit)
      .then((res) => {
        setStructureUnits([
          ...structureUnits.filter(
            (Unit) => Unit.StructureUnitID !== structureUnit.StructureUnitID
          ),
          {
            ...structureUnit,
            StructureUnitID: structureUnit.StructureUnitID,
          },
        ]);

        setStructureUnit({
          StructureUnitName: "",
          StructureUnitID: "",
        });
        setUpdateMode(false);
        setShowStructureInput(!structureUnit);
        setMessage(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteStructureUnit = async (StructureUnitID) => {
    await axios
      .delete(`${HTTP}/deleteStructureInit/${StructureUnitID}`)
      .then((res) => {
        if (res.data.status == "success") {
          setStructureUnits([
            ...structureUnits.filter(
              (Unit) => Unit.StructureUnitID !== StructureUnitID
            ),
          ]);
        }
        console.log(StructureUnitID);
        setMessage(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSelectUnit = (eventKey) => {
    setPositionData({
      ...positionData,
      StructureUnitID: eventKey,
      StructureUnitName:
        structureUnits.find((unit) => unit.StructureUnitID == eventKey)
          ?.StructureUnitName || "",
    });
  };

  const handleSelectPosition = (eventKey) => {
    setPositionData({
      ...positionData,
      positionName:
        positions.find((position) => position.HolderPositionID == eventKey)
          ?.HolderPositionName || "",
    });
    setCardHolder((ch) => ({
      ...ch,
      HolderPositionID: eventKey,
    }));
  };

  useEffect(() => {
    getStructureUnit();
    getPositions();
  }, [cardHolder]);

  useEffect(() => {
    setFilterPositions([
      ...positions.filter(
        (position) => position.StructureUnitID == positionData.StructureUnitID
      ),
    ]);
  }, [positionData.StructureUnitID]);

  const getPosition = async () => {
    await axios
      .get(`${HTTP}/getPosition/${cardHolder.HolderPositionID}`)
      .then((res) => {
        if (res.status == 200) {
          setPositionData(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPosition();
  }, [cardHolder]);

  return (
    <Accordion className="my-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>პოზიციის დეპარტამენტის დამატება</Accordion.Header>
        <Accordion.Body className="bpg-arial-normal ">
          <Col className="d-flex gap-5">
            <Col className="d-flex gap-2 align-item-center">
              <Col>
                <Form.Label className="m-2" aria-required>
                  სტრუქურული ერთეული <span className="text-danger">*</span>
                </Form.Label>
                <Dropdown
                  title={positionData.StructureUnitName}
                  onSelect={handleSelectUnit}
                >
                  <Dropdown.Toggle variant="light" className="w-100">
                    {positionData.StructureUnitName
                      ? positionData.StructureUnitName
                      : "აირჩიე სტრუქტურული ერთეული"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    {structureUnits.map((structureUnit) => (
                      <Dropdown.Item
                        eventKey={structureUnit.StructureUnitID}
                        key={structureUnit.StructureUnitID}
                      >
                        {structureUnit.StructureUnitName}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Form.Group className="col">
                <Form.Label className="m-2" aria-required>
                  პოზიცია <span className="text-danger">*</span>
                </Form.Label>
                {hidePositionDropDown ? (
                  <InputGroup>
                    <Form.Control
                      disabled={!positionData.StructureUnitID}
                      type="text"
                      className="rounded-start-0 shadow-none"
                      placeholder="პოზიცია"
                      value={positionData.positionName}
                      onChange={(e) => {
                        setPositionData({
                          ...positionData,
                          positionName: e.target.value,
                        });
                      }}
                    />
                  </InputGroup>
                ) : (
                  <Dropdown
                    title={positionData.positionName}
                    onSelect={handleSelectPosition}
                  >
                    <Dropdown.Toggle
                      variant="light"
                      className="w-100"
                      disabled={!positionData.StructureUnitID}
                    >
                      {positionData.positionName
                        ? positionData.positionName
                        : "აირჩიე პოზიცია"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {filteredPosition.map((position) => (
                        <Dropdown.Item
                          eventKey={position.HolderPositionID}
                          key={position.HolderPositionID}
                        >
                          {position.HolderPositionName}
                        </Dropdown.Item>
                      ))}
                      {filteredPosition.length < 1 && (
                        <span className="mx-2">პოზიცია დამატებული არ არის</span>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                <Col className="d-flex align-items-center justify-content-end  px-2 rounded ms-auto mt-2">
                  <span className="me-2 ">პოზიციის დამატება</span>
                  <Form.Check
                    type="switch"
                    className="mt-0"
                    onChange={() => {
                      setHidePositionDropDown(!hidePositionDropDown);
                      setPositionData({
                        ...positionData,
                        positionName: "",
                      });
                    }}
                    checked={hidePositionDropDown}
                  />
                </Col>
              </Form.Group>
            </Col>
          </Col>
          <Col className="d-flex justify-content-end mt-3">
            {hidePositionDropDown && (
              <Button
                variant="success"
                className="rounded-1 "
                onClick={addPosition}
              >
                დამატება
              </Button>
            )}
          </Col>
          <Col className="mt-3">
            {!showStructureInput ? (
              <Button
                variant="success"
                className="mt-2 col-12"
                size="sm"
                onClick={() => {
                  setShowStructureInput(!showStructureInput);
                  setUpdateMode(false);
                  setStructureUnit({
                    StructureUnitName: "",
                    StructureUnitID: "",
                  });
                }}
              >
                + სტრუქტურული ერთეულის დამატება
              </Button>
            ) : (
              <Col className="d-flex gap-2">
                <InputGroup>
                  <Form.Control
                    type="text"
                    className="rounded-0 shadow-none"
                    placeholder="სტრუქტურული ერთეული"
                    value={structureUnit.StructureUnitName}
                    onChange={(e) => {
                      setStructureUnit({
                        ...structureUnit,
                        StructureUnitName: e.target.value,
                      });
                    }}
                  />
                </InputGroup>
                {!updateMode ? (
                  <Button
                    variant="primary"
                    className="rounded-1 w-100"
                    onClick={() => {
                      if (structureUnit.StructureUnitName) {
                        addStructureUnit();
                      }
                    }}
                  >
                    დამატება
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="rounded-1 w-100"
                    onClick={() => {
                      if (structureUnit.StructureUnitName) {
                        editStructureUnit();
                      }
                    }}
                  >
                    რედაქტირება
                  </Button>
                )}
                <AiFillCloseSquare
                  className="text-danger w-20px "
                  style={{ cursor: "pointer", height: "40px", width: "40px" }}
                  onClick={() => {
                    setShowStructureInput(!showStructureInput);
                  }}
                />
              </Col>
            )}
            <Col>
              <Button
                variant="primary"
                className="mt-2 col-12"
                size="sm"
                onClick={() => {
                  setShowStructureUnits(!showStructureUnits);
                }}
              >
                სტრუქტურული ერთეულები
              </Button>
              {showStructureUnits && (
                <Col className="mt-2">
                  {structureUnits.map((unit) => (
                    <Col
                      key={unit.StructureUnitID}
                      className="d-flex justify-content-start gap-2 align-items-center"
                    >
                      <MdDelete
                        className="text-danger "
                        onClick={() =>
                          deleteStructureUnit(unit.StructureUnitID)
                        }
                        style={{ cursor: "pointer" }}
                      />
                      <FaEdit
                        className="text-success"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setUpdateMode(true);
                          setShowStructureInput(true);
                          setStructureUnit({
                            ...unit,
                          });
                        }}
                      />
                      <span>{unit.StructureUnitName}</span>
                    </Col>
                  ))}
                </Col>
              )}
            </Col>
          </Col>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
