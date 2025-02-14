import { Container, Col, Form, InputGroup, Button, Spinner, Image, Table, DropdownButton, Dropdown, Pagination, Modal } from "react-bootstrap";
import { HiOutlineDevicePhoneMobile, HiOutlineIdentification } from "react-icons/hi2";
import { BsCreditCard2Front } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const Reports = () => {
    const [holders, setHolders] = useState(null);
    const [holderIDs, setHolderIDs] = useState([]);
    const [nonOutcomedCards, setNonOutcomedCards] = useState([]);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState(new Date().toLocaleDateString("en-GB").split("/").reverse().join("-"));
    const [endDate, setEndDate] = useState(new Date().toLocaleDateString("en-GB").split("/").reverse().join("-"));
    const [filteredHolders, setFilteredHolders] = useState([]);
    const [tableList, setTableList] = useState([]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);

    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    const [paginationLimit, setPaginationLimit] = useState(10);
    const [lastModula, setLastModula] = useState(0);
    const [nextModula, setNextModula] = useState(paginationLimit);

    const [handleEnd, setHandleEnd] = useState(false);
    const [holderEvents, setHolderEvents] = useState({
        CardUID: undefined,
        Date: '',
        endTime: '',
        comment: '',
    })
    const showHandleEnd = (CardUID, Date) => {
        setHandleEnd(true);
        setHolderEvents({ CardUID, Date, endTime: '', comment: '' });
    }
    const hideHandleEnd = () => {
        setHandleEnd(false);
        setHolderEvents({
            CardUID: undefined,
            Date: '',
            endTime: '',
            comment: '',
        })
    }

    const params = useParams();

    const { entrance } = params;

    const url = process.env.REACT_APP_LOCAL_IP;

    const getHolders = async () => {
        setIsLoading(true)
        await axios.get(url + ":5000/getholders")
            .then(res => {
                if (res.status === 200) {
                    setHolders(res.data);
                    setFilteredHolders(res.data);
                    setIsLoading(false);
                }
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        setHolderIDs([]);
        getHolders();
    }, []);

    const handleFilterHolders = () => {
        let _filteredHolders;
        if (search) {
            _filteredHolders = holders.filter(x => [x.FirstName, x.LastName, x.PrivateNumber, x.PhoneNumber, x.Email, x.IdentNumber].join(' ').includes(search));
        }
        else _filteredHolders = holders;

        setFilteredHolders(_filteredHolders);
    }

    const getHoldersReport = async () => {
        setTableLoading(true);
        await axios.get(`${url}:5000/reports?ids=${holderIDs}&startDate=${startDate}&endDate=${endDate}&page=${page}&itemsPerPage=${itemsPerPage}`)
            .then(res => {
                if (res.status === 200) {
                    const _page = Math.ceil(res.data.logCount / itemsPerPage);
                    setTableList(res.data.reports);
                    setPage(_page < page || _page < 1 ? 1 : page);
                    setPages(_page);
                    setTableLoading(false);
                }
            })
            .catch(err => console.log(err))
    }

    const getNonOutcomedCards = async () => {
        await axios.get(`${url}:5000/nonoutcomedcards`)
            .then(res => {
                if (res.status === 200) {
                    setNonOutcomedCards(res.data);
                }
            })
            .catch(console.error);
    }

    useEffect(() => { getHoldersReport() }, [holderIDs])

    const handleSelectCardHolders = (id) => {
        let IDs = [...holderIDs];
        if (!IDs.includes(id)) IDs.push(id);
        else IDs = IDs.filter(x => x !== id);
        setHolderIDs(IDs);
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

    const handleEndOutcome = async () => {
        await axios.post(`${url}:5000/handleendoutcome`, holderEvents).then(res => {
            if (res.status === 200) {
                getNonOutcomedCards();
                hideHandleEnd();
            }
        })
            .catch(console.error);
    }

    useEffect(() => {
        getHoldersReport();
        getNonOutcomedCards();
    }, [page]);

    return (
        <Container fluid style={{ maxHeight: "100vh", flex: 1 }} className="d-flex overflow-hidden">
            <Col className="d-flex p-2 gap-2" style={{ height: "100%" }}>
                <Col className="d-flex flex-column gap-2 p-1 col-4" style={{ height: "100%" }}>
                    <Col className="col-12 bpg-arial">
                        <Form.Group className="col-11 mx-auto p-2 rounded-3 shadow bg-primary">
                            <InputGroup className="gap-2">
                                <Form.Control type="search" className="rounded-2 shadow-none" placeholder="სახელი, გვარი, პ/ნ, ტელ.ნომერი, ელ-ფოსტა, uid..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && handleFilterHolders()} />
                                <Button variant="dark" className="rounded-2 px-4" onClick={handleFilterHolders}>ძებნა</Button>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col className="col-11 mx-auto rounded-4 bpg-arial d-flex flex-column gap-2 py-4 shadow overflow-v" style={{ flex: 1 }}>
                        {isLoading && <Spinner className="mx-auto" animation="border" variant="primary" />}
                        {!isLoading && filteredHolders && filteredHolders.map((x, i) => {
                            return (
                                <Col key={i} className={`btn ${holderIDs.includes(x.CardHolderID) ? 'btn-dark' : 'btn-light'} col-11 p-1 mx-auto rounded-3 shadow border border-1 ${holderIDs.includes(x.CardHolderID) ? "border-success" : "border-info"} d-flex flex-column`} style={{ fontWeight: 400, cursor: "pointer" }} onClick={() => handleSelectCardHolders(x.CardHolderID)}>
                                    <Col className="col-12 d-flex p-1">
                                        <Col className="col-7 d-flex align-items-center" style={{ fontWeight: "bold" }}><Image src={url + ":5000" + x.Photo} width={40} /><span className="mt-1 ms-1">{x.FirstName} {x.LastName}</span></Col>
                                        <Col className="col-5 d-flex align-items-center justify-content-end ms-auto"><span className="px-2 bg-warning text-dark rounded-2 shadow-sm" style={{ fontWeight: "bold" }}>{i + 1}</span></Col>
                                    </Col>
                                    <Col className="col-12 d-flex p-1">
                                        <Col className="col-7 d-flex align-items-center"><HiOutlineDevicePhoneMobile /> <span className="mt-1 ms-1">{x.PhoneNumber}</span></Col>
                                        <Col className="col-5 d-flex align-items-center justify-content-end"><HiOutlineIdentification /> <span className="ms-1">{x.PrivateNumber}</span></Col>
                                    </Col>
                                    <Col className="col-12 d-flex p-1">
                                        <Col className="col-7 d-flex align-items-center"><MdAlternateEmail /> <span className="ms-1">{x.Email}</span></Col>
                                        <Col className="col-5 d-flex align-items-center justify-content-end"><BsCreditCard2Front /> <span className={`ms-1 ${x.ActivationStatus ? 'text-success' : 'text-danger'}`}>{x.CardUID}</span></Col>
                                    </Col>
                                </Col>
                            )
                        })}
                    </Col>
                </Col>
                {tableLoading && holderIDs.length > 0 && <Spinner className="mx-auto d-flex my-2" animation="border" variant="primary" />}
                {!tableLoading && (
                    <Col className="p-2 ms-3 d-flex flex-column">
                        <Col className="mb-2 d-flex gap-3 bpg-arial p-2 rounded-3 shadow bg-primary" style={{ flex: 0 }}>
                            <Col className="col-2">
                                <Form.Control type="date" className="shadow-none rounded-2" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </Col>
                            <Col className="col-2">
                                <Form.Control type="date" className="shadow-none rounded-2" value={endDate} onChange={e => setEndDate(e.target.value)} />
                            </Col>
                            <Col className="col-auto">
                                <DropdownButton variant="light" id="dropdown-item-button" title={itemsPerPage}>
                                    <Dropdown.Item as="button" className="text-center" onClick={() => setItemsPerPage(50)}>50</Dropdown.Item>
                                    <Dropdown.Item as="button" className="text-center" onClick={() => setItemsPerPage(100)}>100</Dropdown.Item>
                                    <Dropdown.Item as="button" className="text-center" onClick={() => setItemsPerPage(150)}>150</Dropdown.Item>
                                    <Dropdown.Item as="button" className="text-center" onClick={() => setItemsPerPage(200)}>200</Dropdown.Item>
                                </DropdownButton>
                            </Col>
                            <Col>
                                <Button variant="dark" className="rounded-2" onClick={getHoldersReport}>გაფილტვრა</Button>
                            </Col>
                            <Col className="d-flex justify-content-end ms-auto">
                                <Col className="p-1 d-flex justify-content-end align-items-center text-light rounded-2 col-auto">რეპორტი</Col>
                            </Col>
                        </Col>
                        <Col className="p-3 rounded-4 shadow bpg-arial d-flex flex-column overflow-hidden col-auto" style={{ flex: 1 }}>
                            <Col className="col-auto overflow-v d-flex flex-column" style={{ flex: 1 }}>
                                <Table striped bordered hover>
                                    <tbody>
                                        <tr className="table-dark position-sticky top-0 border-light m-0">
                                            {['მფლობელი', 'ბარათის UID', 'თარიღი', 'შემოსვლა/გასვლა', 'ხანგრძლივობა'].map(x => {
                                                return <th key={x} className="text-light">{x}</th>
                                            })}
                                        </tr>
                                        {nonOutcomedCards && nonOutcomedCards.map((x, i) => {
                                            return (
                                                <tr key={i} className={`${x.IncomeDay === entrance?.split("-").join("/") && 'bg-success text-light'}`}>
                                                    <td>{x.FirstName} {x.LastName}</td>
                                                    <td>{x.CardUID}</td>
                                                    <td>{x.IncomeDay}</td>
                                                    <td>{x.StartTime}  -<IoIosClose className="fs-2 text-danger" /></td>
                                                    <td className="d-flex align-items-center">{x.Duration}სთ <Button variant="warning" size="sm" className="ms-auto" onClick={() => showHandleEnd(x.CardUID, x.IncomeDay)}>გასვლა</Button></td>
                                                </tr>
                                            )
                                        })}
                                        {tableList && tableList.map((x, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{x.FirstName} {x.LastName}</td>
                                                    <td>{x.CardUID}</td>
                                                    <td>{x.IncomeDay}</td>
                                                    <td>{x.StartTime} - {x.EndTime}</td>
                                                    <td className="d-flex align-items-center">{x.Duration}სთ</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                        </Col>
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
                )}
                {/* {holderIDs.length === 0 && (
                    <Col className="text-center bpg-arial mt-5 fs-4 text-danger">
                        რეპორტების სანახავად მონიშნეთ თანამშრომლები
                    </Col>
                )} */}
            </Col>
            <HandleEndOutcome handleEnd={handleEnd} hideHandleEnd={hideHandleEnd} handleEndOutcome={handleEndOutcome} holderEvents={holderEvents} setHolderEvents={setHolderEvents} />
        </Container >
    )
}

const HandleEndOutcome = ({ handleEnd, hideHandleEnd, handleEndOutcome, holderEvents, setHolderEvents }) => {
    const changeHolderEvents = (e) => {
        const _holderEvents = { ...holderEvents };
        _holderEvents[e.target.name] = e.target.value;
        setHolderEvents(_holderEvents);
    }

    return (
        <Modal show={handleEnd} backdrop="static" className="bpg-arial-normal">
            <Modal.Header>
                <Modal.Title>ბარათზე გასვლის მოქმედება</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Col className="d-flex flex-column gap-2">
                    <Col className="d-flex gap-2 align-items-center">
                        <Col className="col-auto">გასვლის დრო: <b>{holderEvents.Date}</b></Col>
                        <Form.Control type="time" value={holderEvents.endTime} onChange={changeHolderEvents} className="shadow-none" name="endTime" step={2} />
                    </Col>
                    <Col>
                        <Form.Control as="textarea" value={holderEvents.comment} onChange={changeHolderEvents} className="shadow-none" name="comment" placeholder="დაწერეთ კომენტარი" />
                    </Col>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={hideHandleEnd}>გაუქმება</Button>
                <Button variant="warning" onClick={handleEndOutcome}>შენახვა</Button>
            </Modal.Footer>
        </Modal>
    )
}
export default Reports