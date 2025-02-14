import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Toast, ToastContainer } from "react-bootstrap";

const ChangeIP = () => {
    const [controller, setController] = useState([]);
    const [toast, setToast] = useState(false);
    const hideToast = () => setToast(false);

    const url = process.env.REACT_APP_LOCAL_IP;

    const getIP = async () => {
        await axios.get(`${url}:5000/getip`)
            .then(res => {
                if (res.status === 200) {
                    setController(res.data);
                }
            })
            .catch(console.error);
    }

    useEffect(() => {
        getIP();
    }, []);

    const changeIPValues = (e, i) => {
        const _controller = [...controller];
        _controller[i][e.target.name] = e.target.value;
        setController(_controller);
    }

    const setIP = async (i) => {
        setToast(false);
        await axios.post(`${url}:5000/setip`, controller[i])
            .then(res => {
                if (res.status === 200) {
                    setToast(true);
                }
            })
            .catch(console.error);
    }


    return (
        <Container fluid style={{ height: "100vh" }} className="d-flex overflow-hidden">
            <Col className="d-flex flex-column p-2 gap-2 bpg-arial" style={{ height: "100%" }}>
                <Col className="mb-1 d-flex align-items-center gap-3 rounded-3 bpg-arial py-3 px-2 shadow" style={{ flex: 0 }}>
                    IP მისამართის ცვლილება
                </Col>
                <Col className="d-flex flex-column" style={{ flex: 1 }}>
                    <Col className="d-flex flex-column gap-2" style={{ flex: 0 }}>
                        {controller?.map((x, i) => {
                            return (
                                <Col key={i} className="col-4 p-2">
                                    <Col>{x.Direction === 1 ? 'შემოსვლის' : 'გასვლის'}</Col>
                                    <Col className="d-flex gap-2">
                                        <Form.Control type="text" className="rounded-1" name="IP" placeholder="IP მისამართი" value={x.IP} onChange={e => changeIPValues(e, i)} />
                                        <Button variant="dark" className="rounded-1" onClick={() => setIP(i)}>შეცვლა</Button>
                                    </Col>
                                </Col>
                            )
                        })}
                    </Col>
                </Col>
            </Col>
            <ToastContainer position="bottom-end" className="p-3 bpg-arial-normal">
                <Toast bg="success" show={toast} onClose={hideToast} delay={4000} autohide>
                    <Toast.Header className="text-light bg-success shadow-sm">
                        <img src="" alt="" />
                        <span className="me-auto fs-5">შეტყობინება</span>
                        <small>just now</small>
                    </Toast.Header>
                    <Toast.Body className="text-light">ცვლილება განხორციელდა წარმატებით</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>)
};

export default ChangeIP;
