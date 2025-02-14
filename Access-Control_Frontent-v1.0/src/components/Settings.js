import {
  Container,
  Form,
  Col,
  InputGroup,
  Button,
  DropdownButton,
  Dropdown,
  Modal,
  Table,
  Spinner,
  Image,
  Row,
  Accordion,
} from "react-bootstrap";
import { FaUserAlt } from "react-icons/fa";
import { HiIdentification } from "react-icons/hi2";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import {
  MdAlternateEmail,
  MdKeyboardBackspace,
  MdOutlineDateRange,
} from "react-icons/md";
import {
  BsFillTelephoneFill,
  BsFillCameraFill,
  BsTrash3Fill,
} from "react-icons/bs";
import { TbCheck, TbNumber, TbPin } from "react-icons/tb";
import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "../App";
import { AiOutlineEdit } from "react-icons/ai";

export const Settings = () => {
  const [showEndDate, setShowEndDate] = useState(false);
  const [holiday, setHoliday] = useState({
    startDate: "",
    endDate: "",
    name: "",
  });

  useEffect(() => {
    console.log(holiday);
  }, [holiday]);

  return (
    <Container className="mt-2">
      <Col
        className="bg-dark text-light col-xl-8 mx-auto py-3 px-4 mb-2 fs-5 bpg-arial d-flex align-items-center"
        style={{ letterSpacing: 1, fontWeight: 400 }}
      >
        სადღესასწაულო დეღეების დამატება
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
                value={holiday.name}
                onChange={(e) =>
                  setHoliday({ ...holiday, name: e.target.value })
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
                <span className="me-2 fs-12">რეინჯის არჩევა</span>
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
          <Button
            type="submit"
            variant="dark"
            className="rounded-1 px-5 py-2 fs-5"
            //onClick={registerCardHolder}
          >
            დამატება
          </Button>
        </Col>
      </Form>
      {/* {message.status && (
        <Col
          className={`p-3 mt-3 col-8 mx-auto rounded-3 bg-${
            message.status === "error" ? "danger" : "success"
          } text-light text-center bpg-arial`}
        >
          {message.message}
        </Col>
      )} */}
    </Container>
  );
};
