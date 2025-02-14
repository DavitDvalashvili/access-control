import { useEffect, useRef, useState } from "react"
import { Button, Col, Form } from "react-bootstrap"
import useWebSocket from "react-use-websocket";

const Chat = () => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([]);
    const chatRef = useRef(null);

    const [userId, setUserId] = useState(null);

    const WS_URL = "ws://172.20.10.2:5000";

    const { sendMessage, sendJsonMessage, lastMessage } = useWebSocket(WS_URL, { share: true });

    useEffect(() => {
        if (lastMessage?.data !== null && lastMessage?.data instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
                setMessages([...messages, JSON.parse(reader.result)]);
                console.log(reader.result);
            }
            reader.readAsText(lastMessage.data);
        }

    }, [lastMessage])

    useEffect(() => {
        setUserId(Math.floor(Math.random() * 10000000));
    }, []);

    useEffect(() => {
        console.log(messages);
    }, [messages])


    const messageTo = () => {
        if (message) {
            sendJsonMessage({ userId, message });
            setMessage('');
            setMessages([...messages, { userId, message }]);
        }
    }

    return (
        <Col className="d-flex flex-column bg-info p-3" style={{ height: "100vh" }}>
            {/* <Col className="position-absolute p-1 bg-danger rounded-circle" style={{ left: cursor.x, top: cursor.y }}></Col> */}
            <Col className="col-5 mx-auto rounded-2 mt-4 px-3 py-4 shadow overflow-hidden overflow-v" style={{ backgroundColor: "#2289c5", flex: 1 }} itemRef={chatRef}>
                {messages.length > 0 && messages.map(msg => {
                    return (
                        <Col className="d-flex mb-3">
                            <Col className={`col-auto bg-light p-2 rounded-3 ${msg.userId === userId && 'ms-auto bg-dark text-light'}`}>{msg.message}</Col>
                        </Col>
                    )
                })}
            </Col>
            <Col className="col-5 mx-auto mt-4">
                <Form.Control as="textarea" rows={7} style={{ resize: "none" }} className="shadow-none" placeholder="write something..." value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        messageTo();
                    }
                }} />
            </Col>
            <Col className="col-5 mx-auto mt-2">
                <Button variant="primary" className="btn-lg px-5" onClick={messageTo}>Send</Button>
            </Col>
        </Col>
    )
}
export default Chat