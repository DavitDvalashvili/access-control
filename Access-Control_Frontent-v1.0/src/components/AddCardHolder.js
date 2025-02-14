import { Container, Form, Col, InputGroup, Button, DropdownButton, Dropdown, Modal, Table, Spinner, Image, Row, Accordion } from "react-bootstrap"
import { FaUserAlt } from "react-icons/fa";
import { HiIdentification } from "react-icons/hi2";

import { MdAlternateEmail, MdKeyboardBackspace, MdOutlineDateRange } from "react-icons/md";
import { BsFillTelephoneFill, BsFillCameraFill, BsTrash3Fill } from "react-icons/bs";
import { TbCheck, TbNumber, TbPin } from "react-icons/tb";
import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "../App";
import { AiOutlineEdit } from "react-icons/ai";
import * as XLSX from "xlsx";
import JoinTimeZone from "./timezoneComponents/JoinTimeZone";
import AddTimeZoneGraph from "./timezoneComponents/AddTimeZoneGraph";

const AddCardHolder = () => {
    const url = process.env.REACT_APP_LOCAL_IP;
    const [cardHolder, setCardHolder] = useState({
        FirstName: "",
        LastName: "",
        IdentNumber: "",
        PrivateNumber: "",
        Email: "",
        PhoneNumber: "",
        BirthDate: "",
        Gender: 'true',
        CardUID: "",
        Photo: "",
        PhotoType: "",
        Activated: true,
    });
    const [message, setMessage] = useState("");
    const [xlsxMessage, setXlsxMessage] = useState(false);
    const hideXlsxMessage = () => setXlsxMessage(false);

    const [timezoneModal, setTimezoneModal] = useState(false);
    const [timezone, setTimezone] = useState({
        startTime: '',
        endTime: '',
        weekdayId: [],
        breakTime: [],
    });
    const hideTimezone = (f = undefined) => {
        setTimezoneModal(false);
        setTimezone({ startTime: '', endTime: '', weekdayId: [], breakTime: [] });
        typeof f === 'function' && f();
    }

    const [joinTimezoneModal, setJoinTimezoneModal] = useState(false);
    const [selectedTimezone, setSelectedTimezone] = useState(null);
    const hideJoinTimezone = () => {
        setJoinTimezoneModal(false);
    }

    const { timeZones, setTimeZone, getData } = useStore();

    const [xlsxHolders, setXlsxHolders] = useState(null);
    const [xlsxHeader] = useState(['FirstName', 'LastName', 'IdentNumber', 'PersonalNumber', 'Email', 'Phone', 'DateOfBirth', 'Gender']);
    const [xlsxModal, setXlsxModal] = useState(false);
    const hideXlsxModal = () => {
        setXlsxModal(false);
        setXlsxHolders(null);
    }

    const uploadFromXLSX = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = evt => {
            const result = evt.target.result;
            const wb = XLSX.read(result, { type: "binary", cellDates: true, cellNF: false, cellText: false });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false });
            console.log(data);
            if (data["0"].every(x => xlsxHeader.includes(x)) && data["0"].length === 8) {
                setXlsxHolders(data);
            } else {
                setXlsxMessage(true);
            }
        }
        reader.readAsBinaryString(file);
    }
    useEffect(() => {
        xlsxHolders && setXlsxModal(true);
    }, [xlsxHolders])

    const editPersonalInfo = (e, key) => {
        const _cardholder = { ...cardHolder };
        _cardholder[key] = key === "Activated" ? e.target.checked : e.target.value;
        setCardHolder(_cardholder);
    }

    const uploadPhoto = (e) => {
        const _cardHolder = { ...cardHolder };
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            _cardHolder.Photo = reader.result;
            _cardHolder.PhotoType = file.type;
            setCardHolder(_cardHolder)
        }
    }

    const registerCardHolder = async () => {
        await axios.post(`${url}:5000/registerch`, { ...cardHolder, selectedTimezone })
            .then(res => res.status === 200 && setMessage(res.data))
            .catch(err => console.log(err));
    }

    return (
        <Container className="mt-2">
            <Col className="bg-dark text-light col-xl-8 mx-auto py-3 px-4 mb-2 fs-5 bpg-arial d-flex align-items-center" style={{ letterSpacing: 1, fontWeight: 400 }}>
                ბარათის მფლობელის დამატება
                <Form.Control type="file" className="d-none" id="upxlsx" onChange={uploadFromXLSX} />
                <Form.Label htmlFor="upxlsx" className="btn btn-success m-0 ms-auto">დაამატეთ Excel-დან</Form.Label>
            </Col>
            <Form className="bpg-arial pt-2 pb-4 px-5 col-xl-8 mx-auto shadow" onSubmit={e => e.preventDefault()}>
                <Col className="d-flex gap-5 mb-4">
                    <Form.Group className="col">
                        <Form.Label className="m-1" aria-required>სახელი <span className="text-danger">*</span></Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="rounded-end-0"><FaUserAlt /></InputGroup.Text>
                            <Form.Control type="text" className="rounded-start-0 shadow-none" placeholder="სახელი" value={cardHolder.FirstName} onChange={e => editPersonalInfo(e, "FirstName")} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="col">
                        <Form.Label className="m-1" aria-required>გვარი <span className="text-danger">*</span></Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="rounded-end-0"><FaUserAlt /></InputGroup.Text>
                            <Form.Control type="text" className="rounded-start-1 shadow-none" placeholder="გვარი" value={cardHolder.LastName} onChange={e => editPersonalInfo(e, "LastName")} />
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col className="d-flex gap-5 mb-4">
                    <Form.Group className="col">
                        <Form.Label className="m-1">საიდენტიფიკაციო ნომერი</Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="rounded-end-0"><HiIdentification /></InputGroup.Text>
                            <Form.Control type="text" className="rounded-start-1 shadow-none" placeholder="საიდენტიფიკაციო ნომერი" value={cardHolder.IdentNumber} onChange={e => editPersonalInfo(e, "IdentNumber")} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="col">
                        <Form.Label className="m-1" aria-required>პირადი ნომერი <span className="text-danger">*</span></Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="rounded-end-0"><HiIdentification /></InputGroup.Text>
                            <Form.Control type="text" className="rounded-1 shadow-none" placeholder="პირადობის ნომერი" value={cardHolder.PrivateNumber} onChange={e => editPersonalInfo(e, "PrivateNumber")} />
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col className="d-flex gap-5 mb-4">
                    <Form.Group className="col">
                        <Form.Label className="m-1">ელ-ფოსტა</Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="rounded-end-0"><MdAlternateEmail /></InputGroup.Text>
                            <Form.Control type="email" className="rounded-start-1 shadow-none" placeholder="ელ-ფოსტა" value={cardHolder.Email} onChange={e => editPersonalInfo(e, "Email")} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="col">
                        <Form.Label className="m-1">ტელეფონის ნომერი</Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="rounded-end-0"><BsFillTelephoneFill /></InputGroup.Text>
                            <Form.Control type="text" className="rounded-1 shadow-none" placeholder="ტელეფონის ნომერი" value={cardHolder.PhoneNumber} onChange={e => editPersonalInfo(e, "PhoneNumber")} />
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col className="d-flex gap-5 mb-4">
                    <Form.Group className="col">
                        <Form.Label className="m-1">დაბადების თარიღი</Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="rounded-end-0"><MdOutlineDateRange /></InputGroup.Text>
                            <Form.Control type="date" className="rounded-start-1 shadow-none" value={cardHolder.BirthDate} onChange={e => editPersonalInfo(e, "BirthDate")} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="col">
                        <Form.Label className="m-1">სქესი</Form.Label>
                        <Col className="mt-2 d-flex gap-4">
                            <Col className="d-flex col-auto gap-1">
                                <Form.Check type="radio" id="man" name="sex" className="rounded-1 shadow-none" value={true} onChange={e => editPersonalInfo(e, "Gender")} checked={cardHolder.Gender === 'true'} />
                                <Form.Label htmlFor="man" >მამრობითი</Form.Label>
                            </Col>
                            <Col className="d-flex col-auto gap-1">
                                <Form.Check type="radio" id="woman" name="sex" className="rounded-1 shadow-none" value={false} onChange={e => editPersonalInfo(e, "Gender")} checked={cardHolder.Gender === 'false'} />
                                <Form.Label htmlFor="woman">მდედრობითი</Form.Label>
                            </Col>
                        </Col>
                    </Form.Group>
                </Col>
                <Col className="d-flex gap-5 mb-4">
                    <Form.Group className="col">
                        <Form.Label className="m-1">ფოტო სურათი</Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="rounded-end-0"><BsFillCameraFill /></InputGroup.Text>
                            <Form.Control type="file" className="rounded-start-1 shadow-none" onChange={e => uploadPhoto(e)} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="col">
                        <Form.Label className="m-1">ბარათის UID</Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="rounded-end-0"><TbNumber /></InputGroup.Text>
                            <Form.Control type="text" className="rounded-start-1 shadow-none" placeholder="ბარათის UID" value={cardHolder.CardUID} onChange={e => editPersonalInfo(e, "CardUID")} />
                            <Col className="d-flex align-items-center justify-content-center gap-1 ms-3">
                                <Form.Check id="disableUID" type="checkbox" onChange={e => editPersonalInfo(e, "Activated")} checked={cardHolder.Activated} />
                                <Form.Label htmlFor="disableUID" style={{ fontSize: "0.8em" }} className="mt-2 text-danger">აქტივაცია</Form.Label>
                            </Col>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col className="d-flex gap-3 mb-4">
                    <Button variant="dark" onClick={() => setJoinTimezoneModal(true)}>აირჩიეთ სამუშაო დროები</Button>
                    <Button variant="dark" onClick={() => setTimezoneModal(true)}>ახალი დროის დამატება</Button>
                </Col>
                <Col>
                    <Button type="submit" variant="dark" className="rounded-1 px-5 py-2 fs-5" onClick={registerCardHolder}>დამატება</Button>
                </Col>
            </Form>
            {message.status && (
                <Col className={`p-3 mt-3 col-8 mx-auto rounded-3 bg-${message.status === "error" ? 'danger' : 'success'} text-light text-center bpg-arial`}>
                    {message.message}
                </Col>
            )}
            <XLSXTable xlsxModal={xlsxModal} hideXlsxModal={hideXlsxModal} xlsxHolders={xlsxHolders} url={url} />
            <XLSXMessage xlsxMessage={xlsxMessage} hideXlsxMessage={hideXlsxMessage} />
            {joinTimezoneModal && <JoinTimeZone joinTimezoneModal={joinTimezoneModal} finishJoinTimezone={hideJoinTimezone} selectedTimezone={selectedTimezone} setSelectedTimezone={setSelectedTimezone} finishButtonName={"დასრულება"} />}
            {timezoneModal && <AddTimeZoneGraph timezoneModal={timezoneModal} hideTimezone={hideTimezone} />}
        </Container>
    )
}

const XLSXTable = ({ xlsxModal, hideXlsxModal, xlsxHolders, url }) => {
    const [existingHolders, setExistingHolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const registerFromXLSX = async () => {
        setIsLoading(true);
        await axios.post(`${url}:5000/registerfromxlsx`, xlsxHolders)
            .then(res => {
                if (res.status === 200) {
                    res.data.length === 0 ? setExistingHolders([10n]) : setExistingHolders(res.data);
                    setIsLoading(false);
                }
            })
            .catch(console.error);
    }

    return (
        <Modal show={xlsxModal} className="bpg-arial-normal" backdrop="static" size="xl">
            <Modal.Header>
                <Modal.Title>თანამშრომლების სია</Modal.Title>
            </Modal.Header>
            <Modal.Body className="overflow-hidden d-flex" style={{ maxHeight: '78vh' }}>
                {xlsxHolders && (
                    <Col className="d-flex flex-column overflow-v" style={{ flex: 1 }}>
                        <Table hover="true">
                            <tbody>
                                <tr className="bg-light position-sticky top-0">
                                    {xlsxHolders["0"].map(x => {
                                        return <td><b>{x}</b></td>
                                    })}
                                </tr>
                                {xlsxHolders.map((x, i) => {
                                    if (i > 0) {
                                        const updateColor = existingHolders.length > 0 ? existingHolders.includes(i) ? 'bg-primary text-white' : 'bg-success text-white' : '';
                                        return (
                                            <tr className={`${updateColor}`}>
                                                {x.map((y, j) => {
                                                    return j === 6 ? <td>{new Date(y).toLocaleDateString("en-GB")}</td> : <td>{y}</td>
                                                })}
                                            </tr>
                                        )
                                    }
                                })}
                            </tbody>
                        </Table>
                    </Col>
                )}
            </Modal.Body>
            <Modal.Footer>
                {isLoading && <Spinner variant="success" animation="border" />}
                {!isLoading && (
                    <>
                        <Button variant="dark" onClick={() => { hideXlsxModal(); setExistingHolders([]) }}>დასრულება</Button>
                        <Button variant="success" onClick={registerFromXLSX}>შენახვა</Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    )
}

const XLSXMessage = ({ xlsxMessage, hideXlsxMessage }) => {
    return (
        <Modal show={xlsxMessage} onHide={hideXlsxMessage} backdrop="static" className="bpg-arial-normal" size="xl">
            <Modal.Header className="border-0" closeButton></Modal.Header>
            <Modal.Body>
                <Col className="d-flex flex-column gap-3">
                    <Col className="text-center">Excel-ის სათაურები უნდა შედგებოდეს ფოტოში მოცემული მიმდევრობით და სახელწოდებით</Col>
                    <Col>
                        <Image src="/images/xlsx.png" alt="image not found" thumbnail />
                    </Col>
                    <Col><b>Headers:</b> FirstName, LastName, IdentNumber, PersonalNumber, Email, Phone, DateOfBirth, Gender</Col>
                </Col>
            </Modal.Body>
        </Modal>
    )
}
export default AddCardHolder