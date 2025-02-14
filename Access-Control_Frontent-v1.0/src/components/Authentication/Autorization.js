import axios from "axios";
import { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const Autorization = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const url = process.env.REACT_APP_LOCAL_IP;

    const loginUser = async () => {
        await axios.post(`${url}:5000/login`, {
            username,
            password
        })
            .then(res => {
                if (res.status === 200 && res.data.loggedIn) {
                    navigate("/");
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <Col className="col-12 mx-auto d-flex" style={{ height: "100vh" }}>
            <Col className="col-6 d-flex shadow justify-content-center align-items-center">
                <Form className="col-10 mx-auto bpg-arial" onSubmit={e => e.preventDefault()}>
                    <Col className="text-center fs-4 mb-3">
                        ავტორიზაცია
                    </Col>
                    <Col className="d-flex col-7 mx-auto flex-column gap-4 mb-5">
                        <Form.Group className="col">
                            <Form.Control type="text" className="rounded-0 border-0 border-2 border-dark border-bottom form-control-lg shadow-sm" placeholder="სახელი" value={username} onChange={e => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="col">
                            <Form.Control type="password" className="rounded-0 border-0 border-2 border-dark border-bottom form-control-lg shadow-sm" placeholder="პაროლი" value={password} onChange={e => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button type="submit" variant="dark" className="rounded-0 btn-lg" onClick={loginUser}>შესვლა</Button>
                    </Col>
                </Form>
            </Col>
            <Col className="col-6 p-4 d-flex overflow-none" style={{ backgroundPosition: "center", backgroundSize: "cover", backgroundImage: "url(/images/accesscontrol.jpeg)", backgroundRepeat: "no-repeat" }}>
                <Col className="position-relative">
                    <span className="p-2 fs-6 bg-success text-light position-absolute shadow" style={{ right: 0, bottom: 0 }}>Logical Systems Company</span>
                </Col>
            </Col>
        </Col>
    )
}
export default Autorization