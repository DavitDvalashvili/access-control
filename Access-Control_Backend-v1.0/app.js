import express from "express";
import cors from "cors";
import { parse } from "url";

import session from "express-session";
import cookieParser from "cookie-parser";

import WebSocket, { WebSocketServer } from "ws";
import WebSocketConnection from "websocket/lib/WebSocketConnection.js";
import http from "http";

import CardHolderRoute from "./routes/CardHolderRoute.js";
import CardHolderLOGRoutes from "./routes/CardHolderLOGRoutes.js";
import userRouter from "./routes/userRoutes.js";

import { SerialPort, ReadlineParser } from "serialport";
import { createConnection } from "./controllers/CardHolderLOGController.js";
import axios from "axios";

const app = express();
const port = 5000;

const server = http.createServer(app);

app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: ["http://172.20.10.12:3000"],
    credentials: true,
  })
);

app.use(
  session({
    key: "user",
    secret: "accesscontrol",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date().getTime(),
      maxAge: new Date().getTime(),
      httpOnly: true,
    },
  })
);

app.use(CardHolderRoute);
app.use(CardHolderLOGRoutes);
app.use(userRouter);

app.use("/photos", express.static("photos"));

app.get("/test", (req, res) => {
  // test();
  // console.log(req.query);
  // const { ID } = req.query;
  // const reader = ID.split(";")[0];
  // const cardId = ID.split(";")[1];
  res.send("open");
});

export const wss = new WebSocketServer({ server: server });

let sockets = [];

wss.on("connection", (ws) => {
  ws.on("error", () => ws.terminate());
  console.log("Device Connected!");

  ws.on("message", (data) => {
    console.log(data.toString());
    ws.send(`MIVIGE MESIJI: ${data.toString()}`);
  });

  // sockets.push({
  //     socketSN: ws.protocol.split("|")[1],
  //     connectedOn: new Date().getTime()
  // });

  // const createTimeout = () => {
  //     const timeout = setTimeout(() => {
  //         console.log("checking...");
  //         let socks;
  //         sockets.forEach(socket => {
  //             const timeDifference = (new Date().getTime() - socket.connectedOn);
  //             if (timeDifference > 13000) {
  //                 socks = sockets.filter(x => x.socketSN !== ws.protocol.split('|')[1]);
  //                 ws.terminate();
  //                 clearTimeout(timeout);
  //                 console.log("client terminated!", socks.length);
  //             }
  //         });
  //         if (socks) sockets = socks;
  //     }, 13000);
  //     return timeout;
  // }
  // let timeout = createTimeout();

  ws.on("ping", (data) => {
    console.log(data.toString());
    // console.log(ws.protocol.split('|')[1]);
    // sockets.find(socket => socket.socketSN === ws.protocol.split("|")[1]).connectedOn = new Date().getTime();
    // clearTimeout(timeout);
    // timeout = createTimeout();
    // wss.clients.forEach(client => {
    //     if (client.protocol.split('|')[1] === '123456789' && client.readyState === WebSocket.OPEN) {
    //         client.send("USERS DATA");
    //     }
    // })
  });

  ws.on("close", (closeCode) => {
    console.log(
      "Device connection closed with the code:",
      closeCode,
      WebSocketConnection.CLOSE_DESCRIPTIONS[closeCode]
    );
  });
});

// server.on("upgrade", (request, socket, head) => {
//     console.log(request.headers['sec-websocket-protocol']);
//     const isValidProtocol = request.headers['sec-websocket-protocol']?.split('|')[0] === 'Controller';
//     console.log(isValidProtocol);
//     if (isValidProtocol) {
//         const { pathname } = parse(request.url);
//         if (pathname === "/ping") {
//             wss.handleUpgrade(request, socket, head, ws => {
//                 wss.emit('connection', ws, request);
//             });
//         } else {
//             console.log('undefined path');
//             socket.destroy();
//         }
//     } else {
//         console.log('unregistered protocol');
//         socket.destroy();
//     }
// })

// export const wss = new WebSocketServer({ server: server });

// wss.on("connection", ws => {
//     console.log("connected");
//     ws.on("close", reason => {
//         console.log(WebSocketConnection.CLOSE_DESCRIPTIONS[reason]);
//     })
// })

// const connectWithSerial = async (req, res) => {
//     await SerialPort.list().then(lists => {
//         console.log(lists);
//         const list = lists.find(x => x.manufacturer === "wch.cn");

//         if (list) {
//             let error;
//             console.log(error);
//             const sPort = new SerialPort({ path: list.path, baudRate: 115200 }, (err) => {
//                 console.log(err);
//             });
//             console.log(sPort.isOpen);
//             const parser = new ReadlineParser();
//             sPort.pipe(parser);

//             sPort.on('open', () => {
//                 console.log(1);
//                 res.send('მოწყობილობა დაკავშირებულია');
//             })
//             sPort.on('error', () => {
//                 console.log(2);
//                 res.send('დაფიქსირდა შეცდომა');
//             })
//             sPort.on('data', async data => {
//                 if (data) {
//                     console.log(data.toString());
//                     data = data.toString();
//                     const date = `${new Date().toLocaleDateString("en-GB").split('/').reverse().join('-')} ${new Date().toLocaleTimeString("it-IT")}`
//                     const dataCollection = data.split('-');
//                     data = parseInt(dataCollection[1]?.slice(1, 9), 2).toString().padStart(3, '0') + '-' + parseInt(dataCollection[1]?.slice(8, -1), 2).toString();
//                     let conn;
//                     const DIR = dataCollection[0].replace("#", '') === "1" ? 1 : 0;
//                     console.log(data, DIR);

//                     try {
//                         conn = await createConnection();

//                         await conn.query(`
//                             INSERT INTO Logs (CardUID, EventTime, Direction)
//                             VALUES(?, ?, ?)
//                         `, [data, date, DIR]);

//                         await conn.query(`
//                             SELECT FirstName, LastName, Photo, PrivateNumber, BirthDate, Gender, PhoneNumber, Email, DATE_FORMAT(RegistrationDate, '%Y-%m-%d %H:%i') AS RegistrationDate,
//                             DATE_FORMAT(c.ActivationDate, '%Y-%m-%d %H:%i') AS ActivationDate, DATE_FORMAT(c.DeactivationDate, '%Y-%m-%d %H:%i') AS DeactivationDate,
//                             c.PacketName, (NOW() > c.DeactivationDate) AS OverDue
//                             FROM ostiumconfigdb.cardholders ch
//                             LEFT JOIN ostiumconfigdb.cards c ON ch.CardHolderID = c.CardHolderID
//                             WHERE c.CardUID = ?
//                             LIMIT 1
//                         `, [data])
//                             .then(resp => {
//                                 if (resp?.length > 0) {
//                                     console.log(Buffer.from(`Open-${dataCollection[0].replace("#", '')}`));
//                                     sPort.write(Buffer.from(`Open-${dataCollection[0].replace("#", '')}`), e => console.log(e));
//                                 }

//                                 let socketData = {
//                                     ...resp[0],
//                                     CardUID: data,
//                                     EventTime: date,
//                                     Direction: DIR
//                                 }
//                                 socketData = JSON.stringify(socketData);
//                                 wss?.clients.forEach(client => {
//                                     if (client.readyState === WebSocket.OPEN) {
//                                         client.send(socketData);
//                                     }
//                                 })
//                             })

//                     } catch (err) {
//                         console.log(err);
//                     } finally {
//                         if (conn) conn.end();
//                     }
//                 }
//             });
//             sPort.on('close', () => {
//                 console.log('მოწყობილობა გაითიშა');
//             });
//         } else {
//             res.send('მოწყობილობის მოძებნა ვერ მოხერხდა');
//         }

//     });
// }

// app.get('/serialconnection', async (req, res) => {
//     await connectWithSerial(req, res);
// })

server.listen(port, console.log("server is running on port:", port));
