import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";

const ErrorLogs = () => {
    const [errorLogs, setErrorLogs] = useState(null);

    const url = process.env.REACT_APP_LOCAL_IP;

    const getErrors = async () => {
        await axios.get(`${url}:5000/errorlogs`)
            .then(res => {
                if (res.status >= 200 && res.status <= 226) {
                    setErrorLogs(res.data);
                }
            })
            .catch(console.error);
    }

    useEffect(() => {
        getErrors();
    }, []);

    return (
        <Col className="bpg-arial-normal mx-auto d-flex flex-column h-100 overflow-hidden" style={{ maxHeight: '100vh', flex: 1 }}>
            <Col className="col-10 mx-auto d-flex flex-column overflow-v" style={{ flex: 1 }}>
                <Table striped bordered hover>
                    <tbody>
                        <tr className="table-dark position-sticky top-0 border-light m-0">
                            {['ბარათის UID', 'თარიღი', 'მიმართულება', 'კავშირის დამყარების დრო'].map(x => {
                                return <th key={x} className="text-light">{x}</th>
                            })}
                        </tr>
                        {errorLogs && errorLogs.map((x, i) => {
                            return (
                                <tr key={i}>
                                    <td>{x.CardUID}</td>
                                    <td>{x.EventTime}</td>
                                    <td className={`text-${x.Direction ? 'success' : 'danger'}`}>{x.Direction ? 'შემოსვლა' : 'გასვლა'}</td>
                                    <td>{x.ConnectionTime}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Col>
        </Col>
    )
};

export default ErrorLogs;
