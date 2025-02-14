import { Container, Col, Form, InputGroup, Button, Spinner, Image, Table, Pagination, DropdownButton, Dropdown } from "react-bootstrap";
import { HiOutlineDevicePhoneMobile, HiOutlineIdentification } from "react-icons/hi2";
import { BsCreditCard2Front } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
const WorkTimeAccounting = () => {
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

    const [colors, setColors] = useState(['#ff5e00', '#ff0000', '#206637', '#3658c9', '#992e94', '#3c7f81']);
    const [colorCount, setColorCount] = useState(0);


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
        await axios.get(`${url}:5000/worktimeaccounting?ids=${holderIDs}&startDate=${startDate}&endDate=${endDate}&page=${page}&itemsPerPage=${itemsPerPage}`)
            .then(res => {
                if (res.status === 200) {
                    const _page = Math.ceil(res.data.logCount / itemsPerPage);
                    setTableList(res.data.reportsWithEvTime);
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
                                <Col key={i + 'j'} className={`btn ${holderIDs.includes(x.CardHolderID) ? 'btn-dark' : 'btn-light'} col-11 p-1 mx-auto rounded-3 shadow border border-1 ${holderIDs.includes(x.CardHolderID) ? "border-success" : "border-info"} d-flex flex-column`} style={{ fontWeight: 400, cursor: "pointer" }} onClick={() => handleSelectCardHolders(x.CardHolderID)}>
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
                                <Col className="p-1 d-flex justify-content-end align-items-center text-light rounded-2 col-auto">სამუშაო დროის აღრიცხვა</Col>
                            </Col>
                        </Col>
                        <Col className="p-3 rounded-4 shadow bpg-arial2 d-flex flex-column overflow-hidden col-auto" style={{ flex: 1 }}>
                            <Col className="col-auto overflow-v d-flex flex-column" style={{ flex: 1 }}>
                                <Table bordered hover>
                                    <tbody>
                                        <tr className="table-dark position-sticky border-light m-0" style={{ top: -1 }}>
                                            {['#', 'მფლობელი', 'თარიღი', 'შემოსვლა', 'გასვლა', 'ხანგრძლივობა'].map((x, i) => {
                                                return <th key={i + 'z'} className={`text-light ${i === 0 && 'text-center'}`} style={{ borderRadius: i === 0 ? "8px 0 0 0" : i === 5 ? "0 8px 0 0" : "" }}>{x}</th>
                                            })}
                                        </tr>
                                        {tableList.map((x, i) => {
                                            let startTime;
                                            let endTime;
                                            let endTime2;
                                            let _color = '#333';
                                            let colCount = 0;
                                            return (
                                                <>
                                                    <tr key={i + 'j'}>
                                                        <td rowSpan={x.eventTime.length + 1} className="text-center">{i + 1}</td>
                                                        <td rowSpan={x.eventTime.length + 1}>{x.FirstName} {x.LastName}</td>
                                                        <td rowSpan={x.eventTime.length + 1}>{x.Date}</td>
                                                    </tr>
                                                    {x.eventTime.map((z, j) => {
                                                        if (z.Direction && !x.eventTime[j + 1]?.Direction) endTime = x.eventTime[j + 1]?.EventTime;
                                                        if (z.Direction) startTime = z.EventTime;
                                                        if (!z.Direction) endTime2 = z.EventTime;
                                                        const timeDiff = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;
                                                        const timeDiff2 = (new Date(endTime2).getTime() - new Date(startTime).getTime()) / 1000;

                                                        const _isNextDirFalse = x.eventTime[j + 1]?.Direction === false;
                                                        const _isNextDirTrue = x.eventTime[j + 1]?.Direction;
                                                        const _isNextSecDirTrueOrUndef = x.eventTime[j + 2]?.Direction || x.eventTime[j + 2]?.Direction === undefined;
                                                        const _isLastItemOfArr = j === x.eventTime.length - 1;

                                                        z.Direction && (colCount = colCount === colors.length - 1 ? 0 : colCount + 1);
                                                        z.Direction && (_color = colors[(colCount + i) % colors.length]);
                                                        return (
                                                            <tr key={j + 'a'}>
                                                                {z.Direction && <td><span style={{ backgroundColor: _isNextDirFalse ? _color : '' }} className={_isNextDirFalse ? 'p-1 rounded-3 text-light' : ''}>{new Date(z.EventTime).toLocaleTimeString("it-IT")}</span></td>}
                                                                {!z.Direction && z.EventTime !== endTime && <td></td>}

                                                                {z.Direction && _isNextDirFalse && <td><span style={{ backgroundColor: _isNextSecDirTrueOrUndef && _color }} className={_isNextSecDirTrueOrUndef ? 'p-1 rounded-3 text-light' : ''}>{new Date(x.eventTime[j + 1].EventTime).toLocaleTimeString("it-IT")}</span></td>}
                                                                {!z.Direction && z.EventTime !== endTime && <td><span style={{ backgroundColor: (_isNextDirTrue || _isLastItemOfArr) ? _color : '' }} className={(_isNextDirTrue || _isLastItemOfArr) ? 'p-1 rounded-3 text-light' : ''}>{new Date(z.EventTime).toLocaleTimeString("it-IT")}</span></td>}

                                                                {z.Direction && _isNextDirFalse && _isNextSecDirTrueOrUndef && <td ><span style={{ border: `2px solid ${_isNextSecDirTrueOrUndef && _color}`, color: _isNextSecDirTrueOrUndef ? _color : '' }} className="p-1 rounded-3">{Math.trunc(timeDiff / 3600).toString().padStart(2, "0")}:{(Math.trunc(timeDiff / 60) % 60).toString().padStart(2, "0")} სთ</span></td>}
                                                                {!z.Direction && (_isNextDirTrue || _isLastItemOfArr) && z.EventTime !== endTime && <td><span style={{ border: `2px solid ${!z.Direction && (_isNextDirTrue || _isLastItemOfArr) && z.EventTime !== endTime && _color}`, color: !z.Direction && (_isNextDirTrue || _isLastItemOfArr) && z.EventTime !== endTime && _color }} className="p-1 rounded-3">{startTime ? (Math.trunc(timeDiff2 / 3600).toString().padStart(2, "0") + ':' + (Math.trunc(timeDiff2 / 60) % 60).toString().padStart(2, "0") + ' სთ') : 'არ შემოსულა'}</span></td>}
                                                            </tr >
                                                        )
                                                    })}
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
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
        </Container >
    )
}
export default WorkTimeAccounting