import mariadb from "mariadb";
import { wss } from "../app.js";
import { WebSocket } from "ws";

const pool = mariadb.createPool({
  host: "127.0.0.1",
  database: "ostiumlogdb",
  user: "root",
  password: "password",
  multipleStatements: true,
  bigIntAsNumber: true,
  insertIdAsNumber: true,
});

export const createConnection = async () => {
  return await pool.getConnection();
};

export const getCardHolders = async (req, res) => {
  let conn;
  try {
    conn = await createConnection();
    const holders = await conn.query(
      `USE ostiumconfigdb; SELECT * FROM get_card_holders`
    );

    res.send(holders[1]);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const getEventMonitor = async (req, res) => {
  let conn;
  const today = new Date()
    .toLocaleDateString("en-GB", { timeZone: "UTC" })
    .split("/")
    .reverse()
    .join("/");
  const minDate = req.query.startDate
    ? (req.query.startDate !== "null"
        ? req.query.endDate &&
          new Date(req.query.startDate) > new Date(req.query.endDate)
          ? req.query.endDate
          : req.query.startDate
        : today
      )
        .split("-")
        .join("/")
    : today;
  const maxDate = req.query.endDate
    ? (req.query.endDate !== "null"
        ? req.query.startDate &&
          new Date(req.query.endDate) > new Date(req.query.startDate)
          ? req.query.endDate
          : req.query.startDate
        : today
      )
        .split("-")
        .join("/")
    : today;
  try {
    conn = await createConnection();

    const events = await conn.query(`
            SELECT CHL.LogID, C.CardID, C.CardHolderID, CH.FirstName, CH.LastName, CHL.CardUID, CHL.EventTime, CHL.Direction
            FROM ostiumlogdb.logs CHL
            ${
              req.query.ident === "false" ? "LEFT JOIN" : "JOIN"
            } ostiumconfigdb.cards C ON CHL.CardUID = C.CardUID
            ${
              req.query.ident === "false" ? "LEFT JOIN" : "JOIN"
            } ostiumconfigdb.cardholders CH ON C.CardHolderID = CH.CardHolderID
            WHERE DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') >= '${minDate}' AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') <= '${maxDate}'
            ${
              req.query.direction === "all"
                ? " AND CHL.Direction IN (1, 0)"
                : req.query.direction === "income"
                ? " AND CHL.Direction = 1"
                : " AND CHL.Direction = 0"
            }
            ORDER BY CHL.EventTime ASC
            OFFSET ${
              (req.query.page < 1 ? 0 : req.query.page - 1) *
                req.query.itemsPerPage || 0
            } ROWS FETCH NEXT ${req.query.itemsPerPage || 50} ROWS ONLY
        `);

    const logCount = await conn.query(`
            SELECT CAST(COUNT(CHL.EventTime) AS FLOAT) as logCount
            FROM ostiumlogdb.logs CHL
            ${
              req.query.ident === "false" ? "LEFT JOIN" : "JOIN"
            } ostiumconfigdb.cards C ON CHL.CardUID = C.CardUID
            ${
              req.query.ident === "false" ? "LEFT JOIN" : "JOIN"
            } ostiumconfigdb.cardholders CH ON C.CardHolderID = CH.CardHolderID
            WHERE DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') >= '${minDate}' AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') <= '${maxDate}'
            ${
              req.query.direction === "all"
                ? " AND CHL.Direction IN (1, 0)"
                : req.query.direction === "income"
                ? " AND CHL.Direction = 1"
                : " AND CHL.Direction = 0"
            }
        `);

    res.send({ ...logCount[0], events });
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const getReports = async (req, res) => {
  let conn;

  const dateFrom = `${new Date().getFullYear()}/${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}/01`;
  const today = new Date()
    .toLocaleDateString("en-GB", { timeZone: "UTC" })
    .split("/")
    .reverse()
    .join("/");
  const minDate = req.query.startDate
    ? (req.query.startDate !== "null"
        ? req.query.endDate &&
          new Date(req.query.startDate) > new Date(req.query.endDate)
          ? req.query.endDate
          : req.query.startDate
        : dateFrom
      )
        .split("-")
        .join("/")
    : dateFrom;
  const maxDate = req.query.endDate
    ? (req.query.endDate !== "null"
        ? req.query.startDate &&
          new Date(req.query.endDate) > new Date(req.query.startDate)
          ? req.query.endDate
          : req.query.startDate
        : today
      )
        .split("-")
        .join("/")
    : today;

  const { ids } = req.query;
  const page =
    (req.query.page < 1 ? 0 : req.query.page - 1) * req.query.itemsPerPage || 0;
  const itemsPerPage = req.query.itemsPerPage || 50;

  try {
    if (ids) {
      conn = await createConnection();

      const reports = await conn.query(
        `
                USE ostiumconfigdb;
                CALL GetReports(?, ?, ?, ?, ?);
            `,
        [ids, minDate, maxDate, page, itemsPerPage, ids, minDate, maxDate]
      );

      console.log(reports);

      res.send({ logCount: reports[2][0].logCount, reports: reports[1] });
    } else {
      res.send([]);
    }
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const getNonOutcomedCards = async (req, res) => {
  let conn;

  try {
    conn = await createConnection();

    const nonOutcomedCards = await conn.query(
      `USE ostiumconfigdb; SELECT * FROM get_nonoutcomed_cards`
    );

    res.send(nonOutcomedCards[1]);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const getCurrentEvent = async (req, res) => {
  let conn;
  const { search } = req.query;

  const page =
    (req.query.page < 1 ? 0 : req.query.page - 1) * req.query.itemsPerPage || 0;
  const itemsPerPage = Number(req.query.itemsPerPage || 50);

  try {
    conn = await createConnection();

    const holders = await conn.query(
      `
            USE ostiumconfigdb;
            SELECT JSON_NORMALIZE(GetCurrentEvent(?, ?, ?)) as holders;
            SELECT GetCELogCount(?) AS logCount;
        `,
      [search, page, itemsPerPage, search]
    );

    res.send({
      logCount: holders[2][0].logCount,
      holders: holders[1][0].holders,
    });
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const getWorkTimeAccounting = async (req, res) => {
  let conn;
  const today = new Date()
    .toLocaleDateString("en-GB", { timeZone: "UTC" })
    .split("/")
    .reverse()
    .join("/");
  const minDate = req.query.startDate
    ? (req.query.startDate !== "null"
        ? req.query.endDate &&
          new Date(req.query.startDate) > new Date(req.query.endDate)
          ? req.query.endDate
          : req.query.startDate
        : today
      )
        .split("-")
        .join("/")
    : today;
  const maxDate = req.query.endDate
    ? (req.query.endDate !== "null"
        ? req.query.startDate &&
          new Date(req.query.endDate) > new Date(req.query.startDate)
          ? req.query.endDate
          : req.query.startDate
        : today
      )
        .split("-")
        .join("/")
    : today;
  try {
    if (req.query.ids) {
      conn = await createConnection();

      const reports = await conn.query(`
                SELECT CH.CardHolderID, CH.FirstName, CH.LastName, DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') as Date
                FROM ostiumlogdb.logs CHL
                LEFT JOIN ostiumconfigdb.cards C ON CHL.CardUID = C.CardUID
                LEFT JOIN ostiumconfigdb.cardholders CH ON C.CardHolderID = CH.CardHolderID
                WHERE CH.CardHolderID IN (${req.query.ids})
                AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') >= '${minDate}' AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') <= '${maxDate}'
                GROUP BY DATE_FORMAT(CHL.EventTime, '%Y/%m/%d'), CH.CardHolderID
                ORDER BY CHL.EventTime ASC
                OFFSET ${
                  (req.query.page - 1) * req.query.itemsPerPage
                } ROWS FETCH NEXT ${req.query.itemsPerPage} ROWS ONLY
            `);

      const logCount = await conn.query(`
                SELECT CAST(COUNT(DISTINCT DATE_FORMAT(CHL.EventTime, '%Y/%m/%d')) AS FLOAT) as logCount
                FROM ostiumlogdb.logs CHL
                LEFT JOIN ostiumconfigdb.cards C ON CHL.CardUID = C.CardUID
                LEFT JOIN ostiumconfigdb.cardholders CH ON C.CardHolderID = CH.CardHolderID
                WHERE CH.CardHolderID IN (${req.query.ids})
                AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') >= '${minDate}' AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') <= '${maxDate}'
            `);

      const eventTime = await conn.query(`
                SELECT CH.CardHolderID, CHL.EventTime, CHL.Direction FROM ostiumlogdb.logs CHL
                JOIN ostiumconfigdb.cards C ON CHL.CardUID = C.CardUID
                JOIN ostiumconfigdb.cardholders CH ON C.CardHolderID = CH.CardHolderID
                WHERE CH.CardHolderID IN (${req.query.ids})
                AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') >= '${minDate}' AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') <= '${maxDate}'
            `);

      const convertToLocaleDate = (date) =>
        new Date(date)
          .toLocaleDateString("en-GB")
          .split("/")
          .reverse()
          .join("/");

      const reportsWithEvTime = reports.map((x) => {
        const evt = eventTime.filter(
          (y) =>
            y.CardHolderID === x.CardHolderID &&
            convertToLocaleDate(y.EventTime) === x.Date
        );
        return {
          ...x,
          eventTime: evt,
        };
      });

      res.send({ ...logCount[0], reportsWithEvTime });
    } else {
      res.send({ logCount: 0, reportsWithEvTime: [] });
    }
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const workTimePlan = async (req, res) => {
  let conn;
  const { ids } = req.query;
  const today = new Date()
    .toLocaleDateString("en-GB", { timeZone: "UTC" })
    .split("/")
    .reverse()
    .join("/");
  const minDate = req.query.startDate
    ? (req.query.startDate !== "null"
        ? req.query.endDate &&
          new Date(req.query.startDate) > new Date(req.query.endDate)
          ? req.query.endDate
          : req.query.startDate
        : today
      )
        .split("-")
        .join("/")
    : today;
  const maxDate = req.query.endDate
    ? (req.query.endDate !== "null"
        ? req.query.startDate &&
          new Date(req.query.endDate) > new Date(req.query.startDate)
          ? req.query.endDate
          : req.query.startDate
        : today
      )
        .split("-")
        .join("/")
    : today;
  const page = (req.query.page - 1) * req.query.itemsPerPage || 0;
  const itemsPerPage = req.query.itemsPerPage || 25;
  try {
    conn = await createConnection();

    const worktimeplan = await conn.query(
      `
            USE ostiumconfigdb;
            CALL GetWorktimePlan(?, ?, ?, ?, ?);
            SELECT GetLogCount_wp(?, ?, ?) AS logCount;
        `,
      [ids, minDate, maxDate, page, itemsPerPage, ids, minDate, maxDate]
    );

    console.log(today);

    res.send({
      logCount: worktimeplan[3][0].logCount,
      worktimeplan: worktimeplan[1],
    });
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const saveReportComment = async (req, res) => {
  let conn;
  const { Id, comment } = req.body;

  try {
    conn = await createConnection();

    await conn
      .query(`USE ostiumlogdb; UPDATE logs SET Comment = ? WHERE LogID = ?`, [
        comment,
        Id,
      ])
      .then(() => res.send("updated"))
      .catch(console.error);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const handleEndOutcome = async (req, res) => {
  let conn;
  const { CardUID, Date, endTime, comment } = req.body;
  const nDate = Date.split("/").join("-");

  try {
    conn = await createConnection();

    await conn
      .query(
        `
            USE ostiumlogdb;INSERT INTO logs (CardUID, EventTime, Direction) VALUES (?, ?, 0);
            UPDATE logs SET Comment = ?
            WHERE LogID = (SELECT LogID FROM logs WHERE DATE_FORMAT(EventTime, '%Y/%m/%d') = ? AND CardUID = ? AND Direction = 1 LIMIT 1)
        `,
        [CardUID, `${nDate} ${endTime}`, comment, Date, CardUID]
      )
      .then(() => {
        res.send("updated");
      })
      .catch(console.error);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

//CONTROLLER
export const accessCard = async (req, res) => {
  let conn;
  console.log(req.query);
  const { ID, DATE, DIR } = req.query;
  const reader = ID.split(";")[0];
  const Id = ID.split(";")[1];
  console.log(ID);
  // console.log(req.query);

  if (ID?.includes(";")) {
    try {
      conn = await createConnection();

      // await conn.query(`
      //     INSERT INTO logs (CardUID, EventTime, Direction)
      //     VALUES(?, ?, ?)
      // `, [UID, DATE.split('_').join(" "), DIR === "IN" ? 1 : 0]);

      await conn.query(
        `
            USE ostiumlogdb;
            INSERT INTO ostiumlogdb.logs (CardUID, EventTime, Direction)
            VALUES(?, NOW(), ?)
        `,
        [Id, Number(reader)]
      );

      await conn
        .query(
          `
            USE ostiumlogdb;
            SELECT FirstName, LastName, Photo, PrivateNumber, BirthDate, Gender, PhoneNumber, Email, RegistrationDate 
            FROM ostiumconfigdb.cardholders ch
            JOIN ostiumconfigdb.cards c ON ch.CardHolderID = c.CardHolderID
            WHERE c.CardUID = ?  
            LIMIT 1  
        `,
          [Id]
        )
        .then((resp) => {
          let data = {
            ...resp[0],
            CardUID: Id,
            EventTime: new Date().toLocaleDateString("en-GB"),
            Direction: Number(reader) === 1 ? 1 : 0,
          };
          data = JSON.stringify(data);
          wss?.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(data);
            }
          });
          if (resp[0]?.FirstName) {
            res.send("open");
          } else {
            res.send("");
          }
        });
    } catch (err) {
      console.log(err);
    } finally {
      if (conn) conn.end();
    }
  } else {
    res.send("");
  }
};

export const getIP = async (req, res) => {
  let conn;

  try {
    conn = await createConnection();

    const controllerIP = await conn.query(`
            SELECT * FROM ostiumconfigdb.controllerip
        `);

    // console.log(controllerIP);

    res.send(controllerIP);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const setIP = async (req, res) => {
  let conn;

  const { Id, IP } = req.body;

  try {
    conn = await createConnection();

    await conn.query(
      `UPDATE ostiumconfigdb.controllerip SET IP = ? WHERE Id = ?`,
      [IP, Id]
    );

    res.send("updated");
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const getControllerIP = async (req, res) => {
  let conn;

  const { DIR } = req.query;

  try {
    conn = await createConnection();

    const controllerIP = await conn.query(
      `SELECT IP FROM ostiumconfigdb.controllerip WHERE Direction = ? LIMIT 1`,
      [DIR]
    );
    // console.log(DIR, `${controllerIP[0].IP}&${new Date().toLocaleDateString("en-GB")}_${new Date().toLocaleTimeString("it-IT")}&${new Date().getDay()}`, controllerIP[0].IP);

    res.send(
      `${controllerIP[0].IP}&${new Date().toLocaleDateString(
        "en-GB"
      )}_${new Date().toLocaleTimeString("it-IT")}&${new Date().getDay()}`
    );
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const saveOfflineCards = async (req, res) => {
  let conn;
  const { logs } = req.query;
  const splitedLog = logs.split("|");
  const direction = splitedLog[0];
  const cards_times = splitedLog[1].split(",");
  const newDate =
    new Date().toLocaleDateString("en-GB").split("/").reverse().join("-") +
    " " +
    new Date().toLocaleTimeString("it-IT");
  console.log(logs);
  try {
    conn = await createConnection();

    cards_times.map((x) => {
      const [CardUID, EventTime] = x.split("$");
      const isDateCorrect =
        new Date(EventTime.split("_").join(" ")).toString() !== "Invalid Date";

      if (isDateCorrect) {
        conn.query(
          `INSERT INTO logs (CardUID, EventTime, Direction) VALUES(?, ?, ?)`,
          [CardUID, EventTime.split("_").join(" "), Number(direction)]
        );
      } else {
        conn.query(
          `INSERT INTO errorlogs (CardUID, EventTime, Direction, ConnectionTime) VALUES(?, ?, ?, ?)`,
          [CardUID, EventTime.split("_").join(" "), Number(direction), newDate]
        );
      }
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(200);
  } finally {
    if (conn) conn.end();
  }
};

export const getErrorlogs = async (req, res) => {
  let conn;

  try {
    conn = await createConnection();

    const errors = await conn.query(`
            SELECT Id, CardUID, EventTime, Direction, DATE_FORMAT(ConnectionTime, '%Y/%m/%d %H:%i:%s') AS ConnectionTime 
            FROM errorlogs
        `);
    res.send(errors);
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  } finally {
    if (conn) conn.end();
  }
};

//192.168.0.250

// Home

export const getDashboardStatistic = async (req, res) => {
  let conn;

  try {
    conn = await createConnection();

    const stat = await conn.query(
      `CALL ostiumconfigdb.GetDashboardStatistic()`
    );

    const data = {
      tardinessEmp: stat[0][0],
      earlyLeaveEmp: stat[1][0],
      notIncomed: stat[2][0],
      incomed: stat[3][0],
    };

    res.send(data);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const getReport = async (req, res) => {
  let conn;

  const { StructureUnitID, StructureUnitName, startDate, endDate } = req.query;

  try {
    conn = await createConnection();

    let query = `
    USE ostiumconfigdb;
    SELECT usr.organisationName, usr.identificationNumber, "${StructureUnitName}" AS StructureUnitName, "${startDate}" AS StartDate, "${endDate}" AS EndDate,
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'FullName', CONCAT(ch.FirstName, ' ', ch.LastName),
            'PersonalNumber', ch.PrivateNumber,
            'Position', hp.HolderPositionName,
            'WorkingInformation', (SELECT 
              JSON_OBJECT(
                'FullDays', (
                  SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'Day', DATE_FORMAT(wta.start_date, '%d'),
                      'WorkingHours', (
                        SELECT IF(wta.end_date,
                          ADDTIME(TIMEDIFF(wta.end_date, wta.start_date), -wta.break_time),
                          wta.absence_reason
                        )
                      )
                    )
                    ORDER BY DATE_FORMAT(wta.start_date, '%Y-%m-%d') ASC
                  )
                ),
                'WorkingDaysSUM', COUNT(CASE WHEN wta.end_date IS NOT NULL THEN wta.wac_id END),
                'WorkingHoursSum', SUM(CASE WHEN wta.end_date IS NOT NULL THEN TIME_TO_SEC(ADDTIME(TIMEDIFF(wta.end_date, wta.start_date), -wta.break_time)) ELSE 0 END) / 60 / 60,
                'OverTime', (
                  (SUM(CASE WHEN wta.end_date IS NOT NULL THEN TIME_TO_SEC(ADDTIME(TIMEDIFF(wta.end_date, wta.start_date), -wta.break_time)) ELSE 0 END) / 60 / 60) - 
                  (
                    SELECT (SUM(
                          (
                            SELECT TIME_TO_SEC(ADDTIME(TIMEDIFF(tzp.endTime, tzp.startTime), - SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time))))))
                            
                            FROM
                            JSON_TABLE(
                              tzp.breakTimes,
                              '$[*]' COLUMNS(
                                start_time VARCHAR(8) PATH '$.startTime',
                                end_time VARCHAR(8) PATH '$.endTime'
                              )
                            ) AS bt
                          )
                    ) * 4) / 60 / 60
                    FROM \`ostiumconfigdb\`.weekdays wd
                    JOIN \`ostiumconfigdb\`.weekdays_timezone_plan wtp ON wtp.weekday_id = wd.Id
                    JOIN \`ostiumconfigdb\`.timezone_plan tzp ON wtp.timezone_plan_id = tzp.Id
                    JOIN \`ostiumconfigdb\`.timezone_group tzg ON tzp.timezone_group_id = tzg.Id
                    JOIN \`ostiumconfigdb\`.card_timezone ctz ON ctz.TimezoneID = tzg.Id
                    WHERE ctz.CardID = c.CardID					
                  )
                ),
                'WorkInHolidaysHours', (
                  SELECT SUM(CASE WHEN wta.end_date IS NOT NULL AND wta.absence_reason IS NOT NULL THEN TIME_TO_SEC(ADDTIME(TIMEDIFF(wta.end_date, wta.start_date), -wta.break_time)) ELSE 0 END) / 60 / 60
                )
                
              )
              
              FROM ostiumlogdb.worktime_accounting wta
              WHERE (c.CardUID = wta.card_uid) AND
              (DATE_FORMAT(wta.start_date, '%Y-%m-%d') >= '${startDate}' AND DATE_FORMAT(wta.start_date, '%Y-%m-%d') <= '${endDate}')
            )
          )
        )
        FROM cards c
        JOIN cardholders ch ON c.CardHolderID = ch.CardHolderID
        JOIN holderposition hp ON c.HolderPositionID = hp.HolderPositionID
        JOIN structureunit su ON hp.StructureUnitID = su.StructureUnitID
        WHERE su.StructureUnitID = ${StructureUnitID}
      ) AS Holders
    
    FROM users usr
    `;

    const reportData = await conn.query(query);

    res.send(reportData[1][0]);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};
