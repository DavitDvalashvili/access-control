import { Container, Col, Table, Form, Button, Dropdown, DropdownButton, Pagination } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaAddressCard } from "react-icons/fa";
const EventMonitor = () => {
    const [eventMonitor, setEventMonitor] = useState(null);
    const [startDate, setStartDate] = useState(new Date().toLocaleDateString("en-GB").split("/").reverse().join("-"));
    const [endDate, setEndDate] = useState(new Date().toLocaleDateString("en-GB").split("/").reverse().join("-"));
    const [ident, setIdent] = useState(false);
    const [direction, setDirection] = useState({ status: 'all', text: 'ყველა' });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    const [paginationLimit, setPaginationLimit] = useState(10);
    const [lastModula, setLastModula] = useState(0);
    const [nextModula, setNextModula] = useState(paginationLimit);

    const url = process.env.REACT_APP_LOCAL_IP;

    const getEventMonitor = async () => {
        setIsLoading(true)
        await axios.get(`${url}:5000/eventmonitor?startDate=${startDate}&endDate=${endDate}&ident=${ident}&direction=${direction.status}&page=${page}&itemsPerPage=${itemsPerPage}`)
            .then(res => {
                if (res.status === 200) {
                    const _page = Math.ceil(res.data.logCount / itemsPerPage);
                    setEventMonitor(res.data.events);
                    setPage(_page < page || _page < 1 ? 1 : page);
                    setPages(_page);
                    setIsLoading(false);
                }
            })
            .catch(err => console.log(err));
    }

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1);
            if (page - 1 <= lastModula) {
                setNextModula(nextModula - paginationLimit);
                setLastModula(lastModula - paginationLimit);
            }
        }
    }
    const handleNext = () => {
        if (page < pages) {
            setPage(page + 1);
            if (page + 1 > nextModula) {
                setNextModula(nextModula + paginationLimit);
                setLastModula(lastModula + paginationLimit);
            }
        }
    }

    const setModulaPrevPage = () => {
        setPage((lastModula - paginationLimit) + 1);
        setLastModula(lastModula - paginationLimit);
        setNextModula(nextModula - paginationLimit);
    }

    const setModulaNextPage = () => {
        setPage(nextModula + 1)
        setLastModula(lastModula + paginationLimit);
        setNextModula(nextModula + paginationLimit);
    }

    useEffect(() => {
        getEventMonitor();
    }, [page]);

    useEffect(() => {
        getEventMonitor();
    }, []);

    return (
        <Container fluid style={{ maxHeight: "100vh", flex: 1 }} className="d-flex overflow-hidden">
            <Col className="d-flex flex-column p-2 gap-2 col-10 mx-auto" style={{ height: "100%" }}>
                <Col className="mb-1 d-flex align-items-center gap-3 rounded-3 bpg-arial p-2 shadow bg-primary" style={{ flex: 0 }}>
                    <Col className="col-2">
                        <Form.Control type="date" className="shadow-none rounded-2" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </Col>
                    <Col className="col-2">
                        <Form.Control type="date" className="shadow-none rounded-2" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </Col>
                    <Col className="col-auto">
                        <DropdownButton variant="light" id="dropdown-limit-button" title={itemsPerPage}>
                            <Dropdown.Item as="button" className="text-center" onClick={() => setItemsPerPage(50)}>50</Dropdown.Item>
                            <Dropdown.Item as="button" className="text-center" onClick={() => setItemsPerPage(100)}>100</Dropdown.Item>
                            <Dropdown.Item as="button" className="text-center" onClick={() => setItemsPerPage(150)}>150</Dropdown.Item>
                            <Dropdown.Item as="button" className="text-center" onClick={() => setItemsPerPage(200)}>200</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    <Col className="col-auto">
                        <DropdownButton variant="light" id="dropdown-item-button" title={direction.text}>
                            <Dropdown.Item as="button" onClick={() => setDirection({ status: 'all', text: 'ყველა' })}>ყველა</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => setDirection({ status: 'income', text: 'შემოსვლა' })}>შემოსვლა</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => setDirection({ status: 'outcome', text: 'გასვლა' })}>გასვლა</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    <Col className="d-flex gap-1 align-items-center col-auto">
                        <Form.Check id="ident" type="checkbox" checked={ident} className="d-none" onChange={e => setIdent(e.target.checked)} />
                        <Form.Label htmlFor="ident" className={`text-${ident ? 'warning' : 'light'} d-flex m-0 fs-1`} style={{ cursor: "pointer" }}><FaAddressCard /></Form.Label>
                    </Col>
                    <Col>
                        <Button variant="dark" className="rounded-2" onClick={getEventMonitor}>გაფილტვრა</Button>
                    </Col>
                    <Col className="d-flex justify-content-end ms-auto">
                        <Col className="p-1 d-flex justify-content-end align-items-center text-light rounded-2 col-auto">მოვლენების მონიტორი</Col>
                    </Col>
                </Col>
                {eventMonitor && (
                    <Col className="col-auto p-3 shadow d-flex flex-column overflow-hidden" style={{ flex: 1 }}>
                        <Col className="overflow-v d-flex flex-column col-auto" style={{ flex: 1 }}>
                            <Table striped bordered hover className="bpg-arial" style={{ fontWeight: 400 }}>
                                <tbody>
                                    <tr className="table-dark position-sticky top-0">
                                        {['#', 'მფლობელი', 'ბარათის UID', 'მოქმედების დრო', 'მოქმედება'].map(x => {
                                            return <th key={x} className="text-light py-3 border">{x}</th>
                                        })}
                                    </tr>
                                    {eventMonitor.map((x, i) => {
                                        const date = new Date(x.EventTime).toLocaleDateString() + " " + new Date(x.EventTime).toLocaleTimeString("en-GB");
                                        return (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{x.FirstName} {x.LastName}</td>
                                                <td>{x.CardUID}</td>
                                                <td>{date}</td>
                                                <td className={`text-${x.Direction ? 'success' : 'danger'}`}>{x.Direction ? 'შემოვიდა' : 'გავიდა'}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                    </Col>
                )}
                <Col className="d-flex justify-content-center align-items-end shadow mt-2 p-2 rounded-4" style={{ flex: 0 }}>
                    <Pagination className="m-0">
                        {/* <Pagination.First onClick={() => setPage(1)} /> */}
                        <Pagination.Prev onClick={handlePrev} />

                        {lastModula + 1 > paginationLimit && (
                            <>
                                <Pagination.Item onClick={setModulaPrevPage}>{(lastModula - paginationLimit) + 1}</Pagination.Item>
                                <Pagination.Ellipsis disabled />
                            </>
                        )}

                        {Array.from({ length: pages >= paginationLimit ? pages < nextModula ? pages - lastModula : paginationLimit : pages }, (v, k) => {
                            const _page = lastModula + (k + 1);
                            return <Pagination.Item key={k} onClick={() => setPage(_page)} active={page === _page}>{_page}</Pagination.Item>
                        })}

                        {pages > nextModula && (
                            <>
                                <Pagination.Ellipsis disabled />
                                <Pagination.Item onClick={setModulaNextPage}>{nextModula + 1}</Pagination.Item>
                            </>
                        )}

                        <Pagination.Next onClick={handleNext} />
                        {/* <Pagination.Last onClick={() => setPage(pages)} /> */}
                    </Pagination>
                </Col>
            </Col>
        </Container >
    )
}
export default EventMonitor