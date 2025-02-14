import { Container, Col, Form, InputGroup, Button, Spinner, Image, Table, Pagination, DropdownButton, Dropdown, Modal } from "react-bootstrap";
import { HiOutlineDevicePhoneMobile, HiOutlineIdentification } from "react-icons/hi2";
import { BsCreditCard2Front } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import { Link } from "react-router-dom";
const WorkTimePlan = () => {
    const [holders, setHolders] = useState(null);
    const [holderIDs, setHolderIDs] = useState([]);
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
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const [report, setReport] = useState(false);
    const [reportComment, setReportComment] = useState({
        Id: null,
        comment: ''
    });
    const editReport = (Id, comment) => {
        setReportComment({
            Id: Id,
            comment: comment
        });
        setReport(true);
    }
    const hideReport = () => {
        setReport(false);
        setReportComment({
            Id: null,
            comment: ''
        });
    }


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

    const getHoldersReport = async (regularFilter = false) => {
        !regularFilter && setTableLoading(true);
        await axios.get(`${url}:5000/worktimeplan?ids=${holderIDs}&startDate=${startDate}&endDate=${endDate}&page=${page}&itemsPerPage=${itemsPerPage}`)
            .then(res => {
                if (res.status === 200) {
                    const _page = Math.ceil(res.data.logCount / itemsPerPage);
                    setTableList(res.data.worktimeplan);
                    setPages(_page);
                    setTableLoading(false);
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getHoldersReport(true);
    }, [page])

    useEffect(() => { getHoldersReport() }, [holderIDs])

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    }
    const handleNext = () => {
        if (page < pages) setPage(page + 1);
    }

    const handleSelectCardHolders = (id) => {
        let IDs = [...holderIDs];
        if (!IDs.includes(id)) IDs.push(id);
        else IDs = IDs.filter(x => x !== id);
        setHolderIDs(IDs);
    }

    return (
        <Container fluid style={{ maxHeight: "100vh", flex: 1 }} className="d-flex overflow-hidden">
            <Col className="d-flex p-2 gap-0" style={{ height: "100%" }}>
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
                {(!tableLoading && holderIDs.length > 0 && tableList.length > -1) && (
                    <Col className="p-1 d-flex flex-column">
                        <Col className="mb-2 d-flex gap-3 bpg-arial p-2 rounded-3 shadow bg-primary" style={{ flex: 0 }}>
                            <Col className="col-2">
                                <Form.Control type="date" className="shadow-none rounded-2" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </Col>
                            <Col className="col-2">
                                <Form.Control type="date" className="shadow-none rounded-2" value={endDate} onChange={e => setEndDate(e.target.value)} />
                            </Col>
                            <Col className="col-auto">
                                <DropdownButton variant="light" id="dropdown-item-button" title={itemsPerPage}>
                                    <Dropdown.Item as="button" className="text-center" onClick={() => setItemsPerPage(25)}>25</Dropdown.Item>
                                    <Dropdown.Item as="button" className="text-center" onClick={() => setItemsPerPage(50)}>50</Dropdown.Item>
                                    <Dropdown.Item as="button" className="text-center" onClick={() => setItemsPerPage(75)}>75</Dropdown.Item>
                                    <Dropdown.Item as="button" className="text-center" onClick={() => setItemsPerPage(100)}>100</Dropdown.Item>
                                </DropdownButton>
                            </Col>
                            <Col>
                                <Button variant="dark" className="rounded-2" onClick={getHoldersReport}>გაფილტვრა</Button>
                            </Col>
                            <Col className="d-flex justify-content-end ms-auto">
                                <Col className="p-1 d-flex justify-content-end align-items-center text-light rounded-2 col-auto">სამუშაო დროის გეგმა</Col>
                            </Col>
                        </Col>
                        <Col className="p-2 d-flex flex-column bpg-arial-normal overflow-v" style={{ flex: 1 }}>
                            {tableList?.map((x, i) => {
                                const startTimeDeviation = x.incomeTime?.timeDeviation;
                                const endTimeDeviation = x.outcomeTime?.timeDeviation;
                                return (
                                    <Col key={i} className="col-12 p-2 shadow mx-auto mb-3">
                                        <Col className="p-2 d-flex align-items-center gap-3 fs-5 bpg-arial rounded-1 shadow mb-2">
                                            <Col className="col-auto">{x.FirstName} {x.LastName}</Col>
                                            <Col className="col-auto">({x.CardUID})</Col>
                                            <Col className="col-auto ms-auto fs-6">{x.entranceDate} - {x.WorkingDay.dayName}</Col>
                                        </Col>
                                        <Col className="p-2 d-flex flex-row gap-2 fs-6">
                                            <Col className="p-2 d-flex flex-column gap-3">
                                                <Col className="p-2 col-auto border border-1 d-flex gap-1 align-items-center">
                                                    დაწყების დრო:<span className="bpg-arial">{x.WorkingDay.startTime}</span>
                                                </Col>
                                                <Col className="p-2 col-auto border border-1 d-flex gap-1 align-items-center">
                                                    შემოსვლის დრო:<span className="bpg-arial">{x.incomeTime?.contact}</span>
                                                </Col>
                                                <Col className={`p-2 col-auto text-light d-flex gap-1 align-items-center ${startTimeDeviation?.includes('-') ? 'bg-danger' : 'bg-success'}`}>
                                                    გადახრა:<span className={`bpg-arial`}>{x.incomeTime?.timeDeviation}</span>
                                                </Col>
                                                {startTimeDeviation?.includes('-') && (
                                                    <Col className={`p-2 col-auto text-light justify-content-center bg-danger d-flex gap-1 align-items-center bpg-arial`}>
                                                        დაგვიანება
                                                    </Col>
                                                )}
                                            </Col>
                                            <Col className="p-2 d-flex flex-column gap-3">
                                                <Col className="p-2 col-auto border border-1 d-flex gap-1 align-items-center">
                                                    დასრულების დრო:<span className="bpg-arial">{x.WorkingDay.endTime}</span>
                                                </Col>
                                                <Col className="p-2 col-auto border border-1 d-flex gap-1 align-items-center">
                                                    გასვლის დრო:<span className="bpg-arial">{x.outcomeTime?.contact || 'არ ფიქსირდება'}</span>
                                                </Col>
                                                <Col className={`p-2 col-auto d-flex gap-1 align-items-center ${endTimeDeviation?.includes('-') ? 'bg-danger text-light' : startTimeDeviation?.includes('-') ? 'bg-warning text-dark' : 'bg-success text-light'}`}>
                                                    გადახრა:<span className={`bpg-arial`}>{x.outcomeTime?.timeDeviation || 'დაუდგენელი'}</span>
                                                </Col>
                                                {endTimeDeviation?.includes('-') && (
                                                    <Col className={`p-2 col-auto text-light justify-content-center bg-danger d-flex gap-1 align-items-center bpg-arial`}>
                                                        ადრე გასვლა
                                                    </Col>
                                                )}
                                            </Col>
                                            <Col className="p-2 col-2" >
                                                {x.totalBreakTime && (
                                                    <Col className="d-flex flex-column gap-3 overflow-v position-relative" style={{ maxHeight: 220 }}>
                                                        <Col className="p-2 col-auto border border-1 d-flex flex-column text-center position-sticky top-0" style={{ backgroundColor: '#ededed' }}>
                                                            <span style={{ fontSize: '.75rem' }}>შესვენებები</span>
                                                            <hr className="m-1" />
                                                            <span className="bpg-arial" style={{ fontSize: '.8rem' }}>სულ: {x.totalBreakTime} საათი</span>
                                                        </Col>
                                                        {x.WorkingDay.breakTime.map(y => {
                                                            return (
                                                                <Col className="p-2 col-auto border border-1 text-center">
                                                                    <span className="bpg-arial">{y.startTime} - {y.endTime} ({y.difference})</span>
                                                                </Col>
                                                            )
                                                        })}
                                                    </Col>
                                                )}
                                                {!x.totalBreakTime && (
                                                    <Col className="p-2 col-auto border border-1 d-flex flex-column text-center position-sticky top-0" style={{ backgroundColor: '#ededed' }}>
                                                        <span>შესვენებები</span>
                                                        <span>არ ფიქსირდება</span>
                                                    </Col>
                                                )}
                                            </Col>
                                            <Col className="p-2 d-flex flex-column gap-3">
                                                <Col className="p-2 col-auto border border-1 d-flex gap-1 align-items-center">
                                                    სამუშაო გეგმა:<span className="bpg-arial">{x.WorkingDay.totalWorkTimePlan} საათი</span>
                                                </Col>
                                                <Col className="p-2 col-auto border border-1 d-flex gap-1 align-items-center">
                                                    ნამუშევარი დრო:<span className="bpg-arial">{x.WorkingDay.totalWorkedTime} საათი</span>
                                                </Col>
                                                {!x.outcomeTime?.contact && (
                                                    <Button as={Link} to={`/reports/${x.entranceDate.split("/").join("-")}`} variant="warning" target="_blank">რეპორტი</Button>
                                                )}
                                                {x.outcomeTime?.contact && (
                                                    <Col className="p-2 col-auto border border-1 d-flex gap-1 align-items-center overflow-hidden position-relative report_comment" style={{ maxHeight: 120 }}>
                                                        <Button variant="primary" className="position-absolute btn-sm" style={{ top: 5, left: 5 }} onClick={() => editReport(x.LogID, x.Comment)}><AiOutlineEdit /></Button>
                                                        <Col className="d-flex overflow-v h-100">
                                                            {x.Comment || 'კომენტარი'}
                                                        </Col>
                                                    </Col>
                                                )}
                                            </Col>
                                        </Col>
                                    </Col>
                                )
                            })}
                        </Col>
                        <Col className="d-flex justify-content-center align-items-end shadow mt-2 p-2 rounded-4" style={{ flex: 0 }}>
                            <Pagination className="m-0">
                                <Pagination.First onClick={() => setPage(1)} />
                                <Pagination.Prev onClick={handlePrev} />

                                {Array.from({ length: pages }, (v, k) => {
                                    return <Pagination.Item key={k} onClick={() => setPage(k + 1)} active={page === k + 1}>{k + 1}</Pagination.Item>
                                })}

                                <Pagination.Next onClick={handleNext} />
                                <Pagination.Last onClick={() => setPage(pages)} />
                            </Pagination>
                        </Col>
                    </Col>
                )}
                {holderIDs.length === 0 && (
                    <Col className="text-center bpg-arial mt-5 fs-4 text-danger">
                        მონიშნეთ თანამშრომლები
                    </Col>
                )}
            </Col>
            <EditReportComment report={report} hideReport={hideReport} reportComment={reportComment} setReportComment={setReportComment} getHoldersReport={getHoldersReport} url={url} />
        </Container >
    )
}

const EditReportComment = ({ report, hideReport, reportComment, setReportComment, getHoldersReport, url }) => {

    const editReportComment = (e) => {
        const _reportComment = { ...reportComment };
        _reportComment.comment = e.target.value;
        setReportComment(_reportComment);
    }

    const saveReportComment = async () => {
        await axios.put(`${url}:5000/savereportcomment`, { ...reportComment })
            .then(res => {
                if (res.status === 200) {
                    hideReport();
                    getHoldersReport(true);
                }
            })
            .catch(console.error);
    }

    return (
        <Modal show={report} onHide={hideReport} size="lg" backdrop="static" className="bpg-arial-normal">
            <Modal.Header>
                <Modal.Title>კომენტარის რედაქტირება</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control as="textarea" placeholder="დაწერეთ რამე..." value={reportComment.comment} onChange={editReportComment} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" className="rounded-1" onClick={saveReportComment}>დამახსოვრება</Button>
                <Button variant="dark" className="rounded-1" onClick={hideReport}>გაუქმება</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default WorkTimePlan