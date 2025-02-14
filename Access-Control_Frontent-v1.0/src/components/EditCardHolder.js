import {
  Container,
  Col,
  Form,
  InputGroup,
  Button,
  Spinner,
  Image,
  Accordion,
  Alert,
  Pagination,
} from "react-bootstrap";
import {
  HiIdentification,
  HiOutlineDevicePhoneMobile,
  HiOutlineIdentification,
} from "react-icons/hi2";
import {
  BsCreditCard2Front,
  BsFillTelephoneFill,
  BsUpload,
} from "react-icons/bs";
import { MdAlternateEmail, MdOutlineDateRange } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import { TbNumber } from "react-icons/tb";
import { TfiClose } from "react-icons/tfi";
import JoinTimeZone from "./timezoneComponents/JoinTimeZone";
import { useStore } from "../App";
import { Link } from "react-router-dom";
import { AddAbsenceDays } from "./AddAbsenceDays";

const EditCardHolder = () => {
  const url = process.env.REACT_APP_LOCAL_IP;
  const { HTTP } = useStore();

  const [holders, setHolders] = useState([]);
  const [holder, setHolder] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasPhotoUploaded, setHasPhotoUploaded] = useState(false);
  const [photo, setPhoto] = useState("");

  const [hasHolderUID, setHasHolderUID] = useState(false);

  const [timezoneModal, setTimezoneModal] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(null);

  // ----------------
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pagesList, setPagesList] = useState([]);
  const [itemsPerPage, setItemPerPage] = useState(100);

  const nextPage = () => {
    const last = pagesList[pagesList.length - 1];
    if (page + 1 > last) {
      skipNextPage();
    } else {
      setPage((page) => page + 1);
    }
  };

  const skipNextPage = () => {
    const last = pagesList[pagesList.length - 1];
    const tempArr = [];
    if (last + 1 < pages && last + 10 < pages) {
      setPage(last + 1);
      for (let i = last + 1; i < last + 11; i++) {
        tempArr.push(i);
      }
      setPagesList(tempArr);
    }
    if (last + 1 <= pages && last + 11 > pages) {
      setPage(last + 1);
      for (let i = last + 1; i < pages + 1; i++) {
        tempArr.push(i);
      }
      setPagesList(tempArr);
    }
  };

  const previousPage = () => {
    const first = pagesList[0];
    if (page - 1 < first) {
      skipPreviousPage();
    } else {
      setPage((page) => page - 1);
    }
  };

  const skipPreviousPage = () => {
    const first = pagesList[0];
    const tempArr = [];
    if (first - 1 > 1 && first - 11 > 1) {
      setPage(first - 1);
      for (let i = first - 1; i > first - 11; i--) {
        tempArr.push(i);
      }
      setPagesList(tempArr.reverse());
    }
    if (first - 1 >= 1 && first - 11 < 1) {
      setPage(first - 1);
      for (let i = first - 1; i > 0; i--) {
        tempArr.push(i);
      }
      setPagesList(tempArr.reverse());
    }
  };

  // ----------------

  const editTimezone = () => {
    if (holder) {
      setTimezoneModal(true);
      setSelectedTimezone(holder.WorkingDays?.Id || 0);
    }
  };
  const hideTimezoneModal = () => {
    setTimezoneModal(false);
    setSelectedTimezone(null);
  };
  const updateTimezone = async () => {
    await axios
      .put(`${HTTP}/editholdertimezone`, {
        CardID: holder.CardID,
        timezoneId: selectedTimezone,
      })
      .then((res) => {
        if (res.status >= 200 && res.status <= 226) {
          const _holder = { ...holder };
          const _holders = [...holders];
          const holderIndex = _holders.findIndex(
            (x) => x.CardHolderID === _holder.CardHolderID
          );
          _holder.WorkingDays = res.data;
          _holders[holderIndex] = _holder;
          setHolder(_holder);
          setHolders(_holders);
          hideTimezoneModal();
        }
      })
      .catch(console.error);
  };

  const searchHolder = async (paging, page) => {
    setPage(page);
    setIsLoading(true);
    // setHolders(null);
    await axios
      .get(
        `${url}:5000/searchch?q=${search}&page=${page}&itemsperpage=${itemsPerPage}`
      )
      .then((res) => {
        if (res.status === 200) {
          const { holders, logCount } = res.data;
          if (!paging) {
            setPages(logCount);
            const pl = [];
            if (logCount > 10) {
              for (let i = 1; i <= 10; i++) {
                pl.push(i);
              }
            } else {
              for (let i = 1; i <= logCount; i++) {
                pl.push(i);
              }
            }
            setPagesList(pl);
          }
          setHolders(holders);
          setIsLoading(false);
          holders?.length === 1 && selectHolder(holders[0]);
          holder &&
            selectHolder(
              holders?.find((x) => x.CardHolderID === holder.CardHolderID)
            );
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    searchHolder(false, 1);
  }, []);

  useEffect(() => {
    searchHolder(true, page);
  }, [page]);

  const getDefaultPhoto = (e) => {
    e.target.src = `${HTTP}/photos/noimage.png`;
    e.onerror = null;
  };

  // useEffect(() => {
  //     if (!holder?.Photo?.includes('base64')) {
  //         getPhoto();
  //     } else {
  //         setPhoto(holder?.Photo);
  //     }
  // }, [holder, hasPhotoUploaded, holders]);

  const updateHolder = async () => {
    if (holder) {
      await axios
        .put(`${HTTP}/updatech`, holder)
        .then((res) => {
          if (res.status === 200) {
            setMessage(res.data);
            const _holders = [...holders];
            const _holderIdx = _holders.findIndex(
              (x) => x.CardHolderID === holder.CardHolderID
            );
            _holders[_holderIdx] = holder;
            setHolders(_holders);
            // setHolder(res.data.holder);
            setHasPhotoUploaded(false);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const editPersonalInfo = (e, key) => {
    const _cardholder = { ...holder };
    _cardholder[key] =
      key === "ActivationStatus" ? e.target.checked : e.target.value;
    setHolder(_cardholder);
  };

  const uploadPhoto = async (e) => {
    if (e.target.files[0]) {
      const _holder = { ...holder };
      const reader = new FileReader();
      const file = e.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        _holder.Photo = reader.result;
        _holder.PhotoType = file.type;
        setPhoto(reader.result);
        setHasPhotoUploaded(true);
        setHolder(_holder);
      };
    }
  };

  const selectHolder = (_holder) => {
    setHasHolderUID(_holder.CardUID?.length !== undefined);
    setHolder(_holder);
  };

  return (
    <Container
      fluid
      style={{ height: "100vh" }}
      className="d-flex overflow-hidden"
    >
      <Col className="d-flex p-2 gap-2" style={{ height: "100%" }}>
        <Col
          className="d-flex flex-column gap-4 col-4 border-end border-2 border-secondary overflow-v"
          style={{ height: "100%" }}
        >
          <Col className="bg-light shadow-sm rounded-2 position-sticky top-0 py-2 col-auto">
            <Col className="col-12">
              <Form.Group className="col-11 mx-auto">
                <InputGroup>
                  <Form.Control
                    type="search"
                    className="rounded-0 shadow-none"
                    placeholder="სახელი, გვარი, პ/ნ, ტელ.ნომერი, ელ-ფოსტა, uid..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && searchHolder(false, 1)
                    }
                  />
                  <Button
                    variant="dark"
                    className="rounded-0 px-4"
                    onClick={() => searchHolder(false, 1)}
                  >
                    ძებნა
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col className="d-flex justify-content-center px-4 mt-2">
              <Pagination className="shadow-sm col-12 mb-0">
                <Pagination.First
                  linkClassName="text-dark"
                  className="col text-center"
                  onClick={skipPreviousPage}
                />
                <Pagination.Prev
                  linkClassName="text-dark"
                  className="col text-center"
                  onClick={previousPage}
                />
                {pagesList.map((x, i) => {
                  return (
                    <Pagination.Item
                      style={{ width: 40 }}
                      linkClassName="text-dark"
                      className="text-center custom-pagination"
                      key={i}
                      active={page === x}
                      onClick={() => setPage(x)}
                    >
                      {x}
                    </Pagination.Item>
                  );
                })}
                <Pagination.Next
                  linkClassName="text-dark"
                  className="col text-center"
                  onClick={nextPage}
                />
                <Pagination.Last
                  linkClassName="text-dark"
                  className="col text-center"
                  onClick={skipNextPage}
                />
              </Pagination>
            </Col>
          </Col>
          <Col className="col-12 bpg-arial d-flex flex-column gap-2">
            {isLoading && (
              <Spinner
                className="mx-auto"
                animation="border"
                variant="primary"
              />
            )}
            {holders &&
              holders.map((x, i) => {
                return (
                  <Col
                    key={i}
                    className={`btn ${
                      x.CardHolderID === holder?.CardHolderID &&
                      x.CardID === holder?.CardID
                        ? "btn-dark"
                        : "btn-light"
                    } col-11 p-1 mx-auto rounded-2 shadow border border-1 ${
                      x.CardHolderID === holder?.CardHolderID
                        ? "border-success"
                        : "border-info"
                    } d-flex flex-column`}
                    style={{ fontWeight: 400, cursor: "pointer" }}
                    onClick={() => selectHolder(x)}
                  >
                    <Col className="col-12 d-flex p-1">
                      <Col
                        className="col-7 d-flex align-items-center"
                        style={{ fontWeight: "bold" }}
                      >
                        <Image
                          src={
                            x?.Photo?.includes(";base64,")
                              ? `${x.Photo}`
                              : `${HTTP}${x.Photo}`
                          }
                          onError={getDefaultPhoto}
                          width={40}
                        />
                        <span className="mt-1 ms-1">
                          {x.FirstName} {x.LastName}
                        </span>
                      </Col>
                      <Col className="col-5 d-flex align-items-center justify-content-end ms-auto">
                        <span
                          className="px-2 bg-warning text-dark rounded-2 shadow-sm"
                          style={{ fontWeight: "bold" }}
                        >
                          {i + 1}
                        </span>
                      </Col>
                    </Col>
                    <Col className="col-12 d-flex p-1">
                      <Col className="col-7 d-flex align-items-center">
                        <HiOutlineDevicePhoneMobile />{" "}
                        <span
                          className={`mt-1 ms-1 ${
                            !x.PhoneNumber && "text-danger"
                          }`}
                        >
                          {x.PhoneNumber || "არ არის მითითებული"}
                        </span>
                      </Col>
                      <Col className="col-5 d-flex align-items-center justify-content-end">
                        <HiOutlineIdentification />{" "}
                        <span className="ms-1">{x.PrivateNumber}</span>
                      </Col>
                    </Col>
                    <Col className="col-12 d-flex p-1">
                      <Col className="col-7 d-flex align-items-center">
                        <MdAlternateEmail />{" "}
                        <span className={`ms-1 ${!x.Email && "text-danger"}`}>
                          {(
                            <Link
                              className="link-success"
                              to={`mailto:${x.Email}`}
                            >
                              {x.Email}
                            </Link>
                          ) || "არ არის მითითებული"}
                        </span>
                      </Col>
                      <Col className="col-5 d-flex align-items-center justify-content-end">
                        <BsCreditCard2Front />{" "}
                        <span
                          className={`ms-1 ${
                            x.ActivationStatus ? "text-success" : "text-danger"
                          }`}
                        >
                          {x.CardUID}
                        </span>
                      </Col>
                    </Col>
                  </Col>
                );
              })}
          </Col>
        </Col>
        {holder && (
          <Col className="col-8 d-flex gap-3">
            <Col className="col-xl-8 ms-2 overflow-v">
              <Col
                className="bg-dark text-light py-3 px-4 mb-2 fs-5 bpg-arial position-sticky top-0"
                style={{ letterSpacing: 1, fontWeight: 400, zIndex: 999 }}
              >
                ბარათის მფლობელის რედაქტირება
              </Col>
              <Form
                className="bpg-arial pt-2 pb-4 px-5 shadow bg-light"
                onSubmit={(e) => e.preventDefault()}
              >
                <Col className="d-flex gap-5 mb-4">
                  <Form.Group className="col">
                    <Form.Label className="m-1" aria-required>
                      სახელი <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="rounded-0">
                        <FaUserAlt />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        className="rounded-0 shadow-none"
                        placeholder="სახელი"
                        value={holder.FirstName}
                        onChange={(e) => editPersonalInfo(e, "FirstName")}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="col">
                    <Form.Label className="m-1" aria-required>
                      გვარი <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="rounded-0">
                        <FaUserAlt />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        className="rounded-1 shadow-none"
                        placeholder="გვარი"
                        value={holder.LastName}
                        onChange={(e) => editPersonalInfo(e, "LastName")}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col className="d-flex gap-5 mb-4">
                  <Form.Group className="col">
                    <Form.Label className="m-1">
                      საიდენტიფიკაციო ნომერი
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="rounded-0">
                        <HiIdentification />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        className="rounded-1 shadow-none"
                        placeholder="საიდენტიფიკაციო ნომერი"
                        value={holder.IdentNumber}
                        onChange={(e) => editPersonalInfo(e, "IdentNumber")}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="col">
                    <Form.Label className="m-1" aria-required>
                      პირადი ნომერი <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="rounded-0">
                        <HiIdentification />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        className="rounded-0 shadow-none"
                        placeholder="პირადობის ნომერი"
                        value={holder.PrivateNumber}
                        onChange={(e) => editPersonalInfo(e, "PrivateNumber")}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col className="d-flex gap-5 mb-4">
                  <Form.Group className="col">
                    <Form.Label className="m-1">ელ-ფოსტა</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="rounded-0">
                        <MdAlternateEmail />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        className="rounded-1 shadow-none"
                        placeholder="ელ-ფოსტა"
                        value={holder.Email}
                        onChange={(e) => editPersonalInfo(e, "Email")}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="col">
                    <Form.Label className="m-1">ტელეფონის ნომერი</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="rounded-0">
                        <BsFillTelephoneFill />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        className="rounded-0 shadow-none"
                        placeholder="ტელეფონის ნომერი"
                        value={holder.PhoneNumber}
                        onChange={(e) => editPersonalInfo(e, "PhoneNumber")}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col className="d-flex gap-5 mb-4">
                  <Form.Group className="col">
                    <Form.Label className="m-1">დაბადების თარიღი</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="rounded-0">
                        <MdOutlineDateRange />
                      </InputGroup.Text>
                      <Form.Control
                        type="date"
                        className="rounded-0 shadow-none"
                        value={new Date(holder?.BirthDate)
                          .toLocaleDateString("en-GB")
                          .split("/")
                          .reverse()
                          .join("-")}
                        onChange={(e) => editPersonalInfo(e, "BirthDate")}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="col">
                    <Form.Label className="m-1">სქესი</Form.Label>
                    <Col className="mt-2 d-flex gap-4">
                      <Col className="d-flex col-auto gap-1">
                        <Form.Check
                          type="radio"
                          id="man"
                          name="sex"
                          className="rounded-0 shadow-none"
                          value={true}
                          onChange={(e) => editPersonalInfo(e, "Gender")}
                          checked={[true, "true"].includes(holder.Gender)}
                        />
                        <Form.Label htmlFor="man">მამრობითი</Form.Label>
                      </Col>
                      <Col className="d-flex col-auto gap-1">
                        <Form.Check
                          type="radio"
                          id="woman"
                          name="sex"
                          className="rounded-0 shadow-none"
                          value={false}
                          onChange={(e) => editPersonalInfo(e, "Gender")}
                          checked={[false, "false"].includes(holder.Gender)}
                        />
                        <Form.Label htmlFor="woman">მდედრობითი</Form.Label>
                      </Col>
                    </Col>
                  </Form.Group>
                </Col>
                <Col className="mb-4 col-12">
                  {!hasHolderUID && (
                    <Alert variant="warning" className="shadow-sm">
                      <Alert.Heading>ბარათი არ არის მიბმული!</Alert.Heading>
                      <p>
                        სამუშაო გრაფიკის დასამატებლად საჭიროა ჯერ ბარათის
                        რეგისტრაცია მომხმარებელზე.
                      </p>
                    </Alert>
                  )}
                  {hasHolderUID && (
                    <Accordion>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header id="acc-header">
                          სამუშაო დღეები
                        </Accordion.Header>
                        <Accordion.Body className="bpg-arial-normal">
                          <Col className="p-2">
                            <Button
                              variant="dark"
                              className="rounded-0"
                              onClick={editTimezone}
                            >
                              რედაქტირება
                            </Button>
                          </Col>
                          <Col className="gap-3 p-2">
                            <Col className="ms-2">
                              {holder?.WorkingDays?.groupName}
                            </Col>
                            <Col className="mt-2">
                              {holder?.WorkingDays?.timezone_plan?.map(
                                (tzp, i) => {
                                  const {
                                    startTime,
                                    endTime,
                                    weekDays,
                                    breakTimes,
                                    breakAnytime,
                                  } = tzp;
                                  return (
                                    <Col
                                      key={i}
                                      className="p-2 border rounded-2 border-secondary mt-2"
                                    >
                                      <small className="text-secondary ms-2">
                                        <i>
                                          დღიური სამუშაო საათობრივი გეგმა{" "}
                                          {i + 1}
                                        </i>
                                      </small>
                                      <Col className="border rounded-2 p-2 d-flex flex-wrap gap-2">
                                        {weekDays.map((wd, j) => {
                                          return (
                                            <Col
                                              key={j}
                                              className="px-2 rounded-3 bg-secondary text-white col-auto"
                                              style={{ fontSize: ".75rem" }}
                                            >
                                              {wd.dayName}
                                            </Col>
                                          );
                                        })}
                                      </Col>
                                      <Col className="p-2 border rounded-2 mt-2">
                                        <InputGroup>
                                          <InputGroup.Text>
                                            დაწყება
                                          </InputGroup.Text>
                                          <InputGroup.Text className="bg-white">
                                            {startTime}
                                          </InputGroup.Text>
                                          <InputGroup.Text>
                                            დასრულება
                                          </InputGroup.Text>
                                          <InputGroup.Text className="bg-white">
                                            {endTime}
                                          </InputGroup.Text>
                                        </InputGroup>
                                      </Col>
                                      <Col className="p-2 border rounded-1 mt-2">
                                        <small className="text-secondary d-flex">
                                          <i className="ms-2">შესვენებები</i>{" "}
                                          <span className="ms-auto me-2">
                                            {breakAnytime === 1
                                              ? "არა ფიქსირებული"
                                              : "ფიქსირებული"}
                                          </span>
                                        </small>
                                        <Col className="p-2">
                                          {breakTimes?.map((bt, j) => {
                                            return (
                                              <InputGroup
                                                key={j}
                                                className="mt-2"
                                              >
                                                <InputGroup.Text>
                                                  {j + 1}
                                                </InputGroup.Text>
                                                <InputGroup.Text>
                                                  {bt.startTime}
                                                </InputGroup.Text>
                                                <InputGroup.Text>
                                                  {bt.endTime}
                                                </InputGroup.Text>
                                              </InputGroup>
                                            );
                                          })}
                                          {breakTimes?.length === 0 && (
                                            <span
                                              style={{ fontSize: ".8rem" }}
                                              className="text-danger"
                                            >
                                              <i>შესვენებები არ ფიქსირდება</i>
                                            </span>
                                          )}
                                        </Col>
                                      </Col>
                                    </Col>
                                  );
                                }
                              )}
                            </Col>
                          </Col>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  )}
                  <AddAbsenceDays holder={holder} setMessage={setMessage} />
                </Col>
                <Col className="d-flex gap-5 mb-4">
                  <Form.Group className="col-6">
                    <Form.Label className="m-1">ბარათის UID</Form.Label>
                    <Col className="col-8">
                      <InputGroup>
                        <InputGroup.Text className="rounded-0">
                          <TbNumber />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          className="rounded-0 shadow-none"
                          placeholder="ბარათის UID"
                          value={holder.CardUID === null ? "" : holder.CardUID}
                          onChange={(e) => editPersonalInfo(e, "CardUID")}
                        />
                      </InputGroup>
                    </Col>
                    <Form.Check
                      id="disableUID"
                      className="mt-2"
                      type="switch"
                      onChange={(e) => editPersonalInfo(e, "ActivationStatus")}
                      label={
                        holder?.ActivationStatus ? "აქტიური" : "არა აქტიური"
                      }
                      checked={holder.ActivationStatus}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Button
                    type="submit"
                    variant="dark"
                    className="rounded-0 px-5 py-2 fs-5"
                    onClick={updateHolder}
                  >
                    რედაქტირება
                  </Button>
                </Col>
              </Form>
              {message.status && (
                <Col
                  className={`d-flex align-items-center p-3 mt-3 rounded-3 bg-${
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
            </Col>
            <Col>
              <Col className="d-flex flex-column col-9 mx-auto">
                <Col
                  className="bg-dark text-light py-3 px-4 fs-5 bpg-arial text-center"
                  style={{ letterSpacing: 1, fontWeight: 400 }}
                >
                  ფოტო
                </Col>
                <Image
                  className="col-12 bg-light shadow"
                  src={
                    !holder?.Photo.includes(";base64,")
                      ? `${HTTP}${holder?.Photo}`
                      : `${holder?.Photo}`
                  }
                  onError={getDefaultPhoto}
                ></Image>
                <Col className="d-flex bpg-arial mt-2 gap-2">
                  <Form.Control
                    id="upload"
                    className="d-none"
                    type="file"
                    onChange={(e) => uploadPhoto(e)}
                  />
                  <Form.Label
                    htmlFor="upload"
                    className="btn btn-dark col rounded-0"
                  >
                    <BsUpload className="mb-1 me-1" /> ატვირთვა
                  </Form.Label>
                  {/* <Form.Label className="btn btn-dark col rounded-0"><BsFillCameraFill className="mb-1 me-1" /> გადაღება</Form.Label> */}
                </Col>
              </Col>
            </Col>
            {timezoneModal && (
              <JoinTimeZone
                joinTimezoneModal={timezoneModal}
                finishJoinTimezone={updateTimezone}
                selectedTimezone={selectedTimezone}
                setSelectedTimezone={setSelectedTimezone}
                finishButtonName={"განახლება"}
              />
            )}
          </Col>
        )}
      </Col>
    </Container>
  );
};

export default EditCardHolder;
