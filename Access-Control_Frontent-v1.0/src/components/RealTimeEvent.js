import React, { useEffect, useState } from "react";
import { Button, Col, Image, Table } from "react-bootstrap";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { useStore } from "../App";
import { BsCreditCard2Front } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import { Link } from "react-router-dom";

const RealTimeEvent = () => {
    const [events, setEvents] = useState([]);
    const [holder, setHolder] = useState(null);
    const [pause, setPause] = useState(false);
    const { realTimeEvents, setRealTimeEvents } = useStore();
    const [showAs, setShowAs] = useState(1);

    const ws_url = process.env.REACT_APP_WS_IP;
    const url = process.env.REACT_APP_LOCAL_IP;

    const { lastJsonMessage } = useWebSocket(ws_url, {
        shouldReconnect: (closeEvent) => true,
        reconnectInterval: 10000,
    });

    useEffect(() => {
        if (lastJsonMessage !== null) {
            setRealTimeEvents([lastJsonMessage, ...realTimeEvents]);
            !pause && lastJsonMessage.FirstName && setHolder(lastJsonMessage);
        }

    }, [lastJsonMessage]);

    return (
        <Col className="p-2 d-flex flex-column bpg-arial-normal gap-3" style={{ height: '100vh' }}>
            <Col className="d-flex py-2 px-3 fs-4 shadow rounded-3 gap-4 align-items-center" style={{ flex: 0 }}>
                რეალ-თაიმ მოვლენები
                <Button variant={pause ? 'success' : 'warning'} className={`pt-2 px-3 col-auto rounded-4`} onClick={() => setPause(!pause)} style={{ fontSize: '.9rem', cursor: 'pointer' }}>დაპაუზება</Button>
                <Col className="col-auto d-flex gap-2 ms-auto" style={{ fontSize: '.85rem' }}>
                    <Col className="d-flex gap-3" style={{ textDecoration: "underline" }}>
                        <Col className="col-auto" style={{ cursor: "pointer" }} onClick={() => setShowAs(1)}>ცხრილი</Col>
                        <Col className="col-auto" style={{ cursor: "pointer" }} onClick={() => setShowAs(2)}>ბარათები</Col>
                    </Col>
                </Col>
            </Col>
            {showAs === 1 && (
                <Col className="col-12 d-flex gap-3" style={{ flex: 1 }}>
                    <Col>
                        {realTimeEvents.length > 0 && (
                            <Table striped bordered hover className="bpg-arial" style={{ fontWeight: 400 }}>
                                <tbody>
                                    <tr className="table-dark position-sticky top-0">
                                        {['#', 'მფლობელი', 'ბარათის UID', 'მოქმედების დრო', 'მოქმედება'].map(x => {
                                            return <th key={x} className="text-light py-3 border">{x}</th>
                                        })}
                                    </tr>
                                    {realTimeEvents?.map((x, i) => {
                                        return (
                                            <tr key={i} style={{ cursor: "pointer" }} onClick={() => x.FirstName && setHolder(x)}>
                                                <td>{i + 1}</td>
                                                <td className={`text-${x.FirstName ? 'success' : 'danger'}`}>{x.FirstName ? `${x.FirstName} ${x.LastName}` : 'დაურეგისტრირებელი ბარათი'}</td>
                                                <td>{x.CardUID === "NaN-NaN" ? 'დაუდგენელი' : x.CardUID}</td>
                                                <td>{x.EventTime}</td>
                                                <td className={`text-${x.Direction === 1 ? 'success' : 'danger'}`}>{x.Direction === 1 ? 'შემოსვლა' : 'გასვლა'}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        )}
                        {realTimeEvents.length === 0 && (
                            <Col className="text-center text-danger fs-3">შემოსვლა/გასვლა არ ფიქსირდება</Col>
                        )}
                    </Col>
                    {holder && (
                        <Col className="col-5">
                            <Col className="p-3 d-flex flex-column gap-2 bg-light position-sticky top-0 shadow">
                                <Col className="d-flex gap-2">
                                    <Image src={`${url}:5000${holder.Photo}`} style={{ width: 210, height: 260, objectFit: "cover", objectPosition: "center" }} thumbnail />
                                    <Col className="d-flex flex-column align-items-start gap-2 fs-5 py-2">
                                        <Col className="col-auto">სახელი: <b>{holder.FirstName}</b></Col>
                                        <Col className="col-auto">გვარი: <b>{holder.LastName}</b></Col>
                                        <Col className="col-auto">პ/ნ: <b>{holder.PrivateNumber}</b></Col>
                                        <Col className="col-auto">დაბადების თარიღი: <b>{new Date(holder.BirthDate).toLocaleDateString("en-GB")}</b></Col>
                                        <Col className="col-auto">სქესი: <b>{holder.Gender === true ? 'მამრობითი' : 'მდედრობითი'}</b></Col>
                                    </Col>
                                </Col>
                                <hr className="my-1" />
                                <Col className="d-flex flex-column gap-0">
                                    <Col className="fs-4 text-center text-dark" style={{ textDecoration: "underline" }}><b>დამატებითი ინფორმაცია</b></Col>
                                    <Col className="d-flex flex-column align-items-start gap-2 fs-5 px-2 py-2">
                                        <Col className="col-auto">ტელეფონი: <b>{holder.PhoneNumber}</b></Col>
                                        <Col className="col-auto">ელ-ფოსტა: <b><Link to={`mailto:${holder.Email}`}>{holder.Email}</Link></b></Col>
                                        <Col className="col-auto">რეგისტრაციის თარიღი: <b>{new Date(holder.RegistrationDate).toLocaleDateString("en-GB")} {new Date(holder.RegistrationDate).toLocaleTimeString("it-IT")}</b></Col>
                                    </Col>
                                </Col>
                            </Col>
                        </Col>
                    )}
                </Col>
            )}
            {showAs === 2 && (
                <Col className="col-10 mx-auto d-flex flex-wrap gap-3 justify-content-center">
                    {realTimeEvents?.map((x, i) => {
                        if (x.FirstName) {
                            return (
                                <Col key={i} className="d-flex gap-1 col-3 p-2 bg-light rounded-3 shadow align-items-center" style={{ height: 190 }}>
                                    <Col className="col-auto">
                                        <Image src={`${url}:5000${x.Photo}`} style={{ width: 120, height: 160, objectFit: "cover", objectPosition: 'center' }} thumbnail></Image>
                                    </Col>
                                    <Col className="d-flex flex-column gap-2 p-3 h-100">
                                        <Col className="col-auto bpg-arial d-flex align-items-center gap-2" style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}><FaUser />{x.FirstName} {x.LastName}</Col>
                                        <Col className="col-auto d-flex align-items-center gap-2"><BsCreditCard2Front />{x.CardUID}</Col>
                                        <Col className="d-flex align-items-end d-flex gap-2 align-items-center"><BiTimeFive />{x.EventTime}</Col>
                                        <Col className={`d-flex align-items-end d-flex gap-2 align-items-center text-${x.Direction === 1 ? 'success' : 'danger'}`}>{x.Direction === 1 ? 'შემოსვლა' : 'გასვლა'}</Col>
                                    </Col>
                                </Col>
                            )
                        } else {
                            return (
                                <Col key={i} className="d-flex flex-column gap-1 col-3 p-2 bg-light rounded-3 shadow" style={{ height: 190 }}>
                                    <Col className="col-auto d-flex align-items-center gap-2 py-3 px-2">
                                        <BsCreditCard2Front /> {x.CardUID === "NaN-NaN" ? 'დაუდგენელი' : x.CardUID}
                                    </Col>
                                    <Col className="d-flex justify-content-center align-items-center text-danger bpg-arial">დაურეგისტრირებელი ბარათი</Col>
                                    {/* <Col className="d-flex flex-column gap-2 p-3 h-100">
                                        <Col className="col-auto bpg-arial d-flex align-items-center gap-2" style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}><FaUser />{x.FirstName} {x.LastName}</Col>
                                        <Col className="col-auto d-flex align-items-center gap-2"><BsCreditCard2Front />{x.CardUID}</Col>
                                        <Col className="d-flex align-items-end d-flex gap-2 align-items-center"><BiTimeFive />{x.EventTime}</Col>
                                        <Col className={`d-flex align-items-end d-flex gap-2 align-items-center text-${x.Direction === 1 ? 'success' : 'danger'}`}>{x.Direction === 1 ? 'შემოსვლა' : 'გასვლა'}</Col>
                                    </Col> */}
                                    <Col className="col-12 d-flex px-2 py-3">
                                        <Col className={`col-auto d-flex gap-1 align-items-center text-${x.Direction === 1 ? 'success' : 'danger'}`}>{x.Direction === 1 ? 'შემოსვლა' : 'გასვლა'}</Col>
                                        <Col className="col-auto d-flex gap-1 align-items-center ms-auto"><BiTimeFive />{x.EventTime}</Col>
                                    </Col>
                                </Col>
                            )
                        }
                    })}
                    {realTimeEvents.length === 0 && (
                        <Col className="text-center text-danger fs-3">შემოსვლა/გასვლა არ ფიქსირდება</Col>
                    )}
                </Col>
            )}
        </Col>
    )
};

export default RealTimeEvent;
