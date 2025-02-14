import axios from "axios";
import { useEffect, useState } from "react"
import { Table, Container, Button, Col, Spinner, Pagination, Form } from "react-bootstrap";
import { IoIosClose } from "react-icons/io";
import { HiOutlineRefresh } from "react-icons/hi";

const CurrentEvent = () => {
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    const [paginationLimit, setPaginationLimit] = useState(10);
    const [lastModula, setLastModula] = useState(0);
    const [nextModula, setNextModula] = useState(paginationLimit);

    const [search, setSearch] = useState('');

    const url = process.env.REACT_APP_LOCAL_IP;

    const getCurrentEvent = async () => {
        setIsLoading(true);
        await axios.get(`${url}:5000/currentevent?search=${search}&page=${page}&itemsPerPage=${itemsPerPage}`)
            .then(res => {
                if (res.status === 200) {
                    const _page = Math.ceil(res.data.logCount / itemsPerPage);
                    setCurrentEvent(res.data.holders);
                    setPage(_page < page || _page < 1 ? 1 : page);
                    setPages(_page);
                    setIsLoading(false);
                }
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getCurrentEvent();
    }, []);

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
        getCurrentEvent();
    }, [page]);

    return (
        <Container className="mt-3 p-0" style={{ height: "calc(100vh - 150px)" }} >
            <Col className="p-2 d-flex gap-2 bpg-arial bg-primary rounded-3 mb-2 align-items-center shadow">
                <Col className="col-3">
                    <Form.Control type="search" className="rounded-2" placeholder="სახელი, გვარი" value={search} onChange={e => setSearch(e.target.value)} />
                </Col>
                <Col className="col-auto">
                    <Button variant="dark" onClick={getCurrentEvent}>გაფილტვრა</Button>
                </Col>
                {isLoading && <Spinner className="col-auto" animation="border" variant="warning" />}
                <Col>
                    <Button variant="warning" className="rounded-circle p-1 d-flex align-items-center fs-3 shadow-sm ms-auto" onClick={getCurrentEvent}><HiOutlineRefresh /></Button>
                </Col>
            </Col>
            {currentEvent && (
                <Col style={{ height: '100%' }} className="overflow-v shadow">
                    <Table striped bordered hover>
                        <tbody className="bpg-arial">
                            <tr className="table-dark position-sticky top-0 m-0">
                                {['მფლობელი', 'შემოსვლა/გასვლა', 'ხანგრძლივობა'].map(x => {
                                    return <th key={x} className="text-light">{x}</th>
                                })}
                            </tr>
                            {currentEvent && currentEvent.map(x => {
                                return (
                                    <tr key={x.CardHolderID} className="bpg-arial">
                                        <td>{x.FirstName} {x.LastName}</td>
                                        <td>{x.connection_time.startTime ? x.connection_time.endTime ? <span className="text-primary">გავიდა</span> : <span className="text-success">შემოსულია</span> : <span className="text-danger">არ შემოსულა</span>}</td>
                                        <td>{!x.connection_time.endTime ? `${Math.floor(x.connection_time.startTime_UNIX / (3600 * 1000))}სთ ${Math.floor(x.connection_time.startTime_UNIX / (60 * 1000)) % 60}წთ` : `${Math.floor(x.connection_time.timeBetween_UNIX / (3600 * 1000))}სთ ${Math.floor(x.connection_time.timeBetween_UNIX / (60 * 1000)) % 60}წთ`}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
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
        </Container>
    )
}
export default CurrentEvent