import mssql from "mssql";
import mariadb from "mariadb";
import fs from "fs";
import { wss } from "../app.js";
import { WebSocket } from "ws";

const pool = mariadb.createPool({
  host: "127.0.0.1",
  database: "ostiumconfigdb",
  user: "root",
  password: "password",
  bigIntAsNumber: true,
});

const createConnection = async () => {
  return await pool.getConnection();
};

export const getWeekDays = async (req, res) => {
  let conn;

  try {
    conn = await createConnection();

    const wd = await conn.query(`SELECT * FROM weekdays ORDER BY dayNumber`);

    res.send(wd);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const registerCardHolder = async (req, res) => {
  let conn;
  const u = req.body;
  const {
    FirstName,
    LastName,
    PrivateNumber,
    Photo,
    IdentNumber,
    BirthDate,
    Gender,
    PhoneNumber,
    Email,
    CardUID,
    Activated,
    selectedTimezone,
  } = req.body;

  // console.log(u);
  try {
    conn = await createConnection();
    const currentDate =
      new Date().toLocaleDateString("en-GB").split("/").reverse().join("-") +
      " " +
      new Date().toLocaleTimeString("it-IT");

    // const holder = await conn.query(`SELECT EXISTS(SELECT * FROM cardholders WHERE PrivateNumber = ?) AS isHolderExists`, [u.PrivateNumber]);
    const photoPath = Photo
      ? `/photos/${u.PrivateNumber}.jpeg`
      : "/photos/defaultphoto.png";
    const cardDeactivation = Activated
      ? `2119-03-10 ${new Date().toLocaleTimeString("it-IT")}`
      : `'${currentDate}'`;
    const holderData = [
      PrivateNumber,
      FirstName,
      LastName,
      IdentNumber,
      BirthDate,
      Gender === "true" ? true : false,
      PhoneNumber,
      Email,
      photoPath,
      CardUID,
      cardDeactivation,
      Activated,
    ];

    conn
      .query(
        `SELECT RegisterCardHolder(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) status`,
        [...holderData]
      )
      .then((resp) => {
        const registrationStatus = JSON.parse(resp[0]?.status);

        if (registrationStatus.status === "success") {
          const { card_id } = registrationStatus;
          conn.query(
            `INSERT INTO card_timezone(cardId, AccessStartDate, timezoneId) VALUES(?, NOW(), ?)`,
            [card_id, selectedTimezone]
          );

          res.send(registrationStatus);
        } else {
          res.send(registrationStatus);
        }
      });
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const registerHolderFromXLSX = async (req, res) => {
  let conn;
  const holders = req.body
    .filter((_, j) => j > 0)
    .map((x) => {
      return {
        FirstName: x[0],
        LastName: x[1],
        IdentNumber: x[2],
        PrivateNumber: x[3],
        Email: x[4],
        Phone: x[5],
        DateOfBirth: new Date(x[6])
          .toLocaleDateString("en-GB")
          .split("/")
          .reverse()
          .join("-"),
        Gender: Number(x[7]),
      };
    });
  const updatesOnHolders = [];

  try {
    conn = await createConnection();

    holders.map((x, i) => {
      const {
        FirstName,
        LastName,
        IdentNumber,
        PrivateNumber,
        Email,
        Phone,
        DateOfBirth,
        Gender,
      } = x;
      const RegistrationDate = `${new Date()
        .toLocaleDateString("en-GB")
        .split("/")
        .reverse()
        .join("-")} ${new Date().toLocaleTimeString("it-IT")}`;
      conn
        .query(
          `
            INSERT INTO cardholders (FirstName, LastName, IdentNumber, PrivateNumber, Email, PhoneNumber, BirthDate, Gender, RegistrationDate, Photo)
            SELECT * FROM (SELECT ? AS FirstName, ? AS LastName, ? AS IdentNumber, ? AS PrivateNumber, ? AS Email, ? AS PhoneNumber, ? AS BirthDate, ? AS Gender, ? AS RegistrationDate, '/photos/noimage.png' AS Photo) AS Temp
            WHERE NOT EXISTS(SELECT PrivateNumber FROM cardholders WHERE PrivateNumber = ?)
            LIMIT 1
        `,
          [
            FirstName,
            LastName,
            IdentNumber,
            PrivateNumber,
            Email,
            Phone,
            DateOfBirth,
            Gender,
            RegistrationDate,
            PrivateNumber,
          ]
        )
        .then((resp) => {
          if (parseInt(resp.insertId) === 0) updatesOnHolders.push(i + 1);
          if (i === holders.length - 1) res.send(updatesOnHolders);
        });
    });
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const getNessesaryData = async (req, res) => {
  let conn;
  try {
    conn = await createConnection();

    const weekDays = await conn.query(`SELECT * FROM weekdays`);
    const timeZones = await conn.query(`
            SELECT t.Id AS timezoneId, t.startTime, t.endTime, t.breakTime, w.Id AS weekdayId, w.dayName, w.dayNumber,
            (SELECT EXISTS(SELECT ct.Id FROM card_timezone ct JOIN cards c ON ct.CardID = c.CardID WHERE ct.TimezoneID = t.Id)) as hasHolder
            FROM timezone t
            JOIN weekdays w ON t.weekdayId = w.Id
            ORDER BY w.dayNumber ASC
        `);

    res.send({ weekDays: weekDays, timeZones: timeZones });
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const getHolderDefinedTimezones = async (req, res) => {
  let conn;
  const { cardId } = req.params;

  try {
    conn = await createConnection();

    const timezones = await conn.query(
      `SELECT JSON_NORMALIZE(GetHolderDefinedTimezones(?)) hdt`,
      [cardId]
    );

    res.send(timezones[0].hdt);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const editHolderTimezones = async (req, res) => {
  let conn;
  const { CardID, timezoneId } = req.body;

  try {
    conn = await createConnection();

    await conn
      .query(`SELECT UpdateHolderTimezones(?, ?) AS res`, [CardID, timezoneId])
      .then((resp) => {
        res.send(resp[0].res);
      });
  } catch (err) {
    console.log(console.error);
  } finally {
    if (conn) conn.end();
  }
};

export const editTimezone = async (req, res) => {
  let conn;
  const { timezoneId, startTime, endTime, weekdayId, breakTime } = req.body;

  try {
    conn = await createConnection();

    await conn
      .query(
        `UPDATE ostiumconfigdb.timezone SET startTime = ?, endTime = ?, weekdayId = ?, breakTime = ? WHERE Id = ?`,
        [startTime, endTime, weekdayId, JSON.stringify(breakTime), timezoneId]
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

export const deleteTimezone = async (req, res) => {
  let conn;
  const { id } = req.params;

  try {
    conn = await createConnection();
    await conn
      .query(`DELETE FROM ostiumconfigdbtimezone WHERE Id = ?`, [id])
      .then(() => res.send("deleted"))
      .catch(console.error);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const getTimezones = async (req, res) => {
  let conn;

  try {
    conn = await createConnection();

    const tz = await conn.query(`SELECT * FROM get_timezones`);

    res.send(tz);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const addTimeZone = async (req, res) => {
  let conn;
  const { groupName, timePlan } = req.body;
  // console.log(groupName);
  // timePlan.map(x => {
  //     console.log(x);
  // })
  try {
    conn = await createConnection();

    conn
      .query(`INSERT INTO timezone_group(groupName) VALUES(?);`, [groupName])
      .then((resp1) => {
        const groupId = resp1.insertId;

        timePlan?.map((tp) => {
          const {
            startTimeH,
            startTimeM,
            endTimeH,
            endTimeM,
            breakAnytime,
            breakTimes,
            weekDays,
          } = tp;
          const startTime = `${startTimeH}:${startTimeM}:00`;
          const endTime = `${endTimeH}:${endTimeM}:00`;

          conn
            .query(
              `
                        INSERT INTO
                        timezone_plan(startTime, endTime, breakAnytime, timezone_group_id, breakTimes)
                        VALUES(?, ?, ?, ?, ?)
                    `,
              [
                startTime,
                endTime,
                breakAnytime ? 1 : 0,
                groupId,
                JSON.stringify(breakTimes),
              ]
            )
            .then((resp2) => {
              const timezonePlanId = resp2.insertId;

              weekDays?.map((wd) => {
                conn.query(
                  `
                                    INSERT INTO weekdays_timezone_plan(weekday_id, timezone_plan_id)
                                    VALUES(?, ?)
                                `,
                  [wd.Id, timezonePlanId]
                );
              });
            });
        });
      });

    res.send("ok");
  } catch (err) {
    console.error();
  } finally {
    if (conn) conn.end();
  }
};

export const updateCardHolder = async (req, res) => {
  let conn;
  const u = req.body;
  try {
    if (u.FirstName && u.LastName && u.PrivateNumber) {
      conn = await createConnection();
      const currentDate =
        new Date().toLocaleDateString("en-GB").split("/").reverse().join("-") +
        " " +
        new Date().toLocaleTimeString("it-IT");
      if (u.Photo && u.PhotoType) {
        const base64Data = u.Photo.replace(
          new RegExp("^data:" + u.PhotoType + ";base64,"),
          ""
        );
        fs.writeFile(
          `photos/${u.PrivateNumber}.jpeg`,
          base64Data,
          "base64",
          (err) => (err ? console.log(err) : "")
        );
      }

      const PhotoPath = u.Photo?.includes("noimage")
        ? "/photos/noimage.png"
        : `/photos/${u.PrivateNumber}.jpeg`;
      const deactivationDate = u.ActivationStatus
        ? `2119-03-10 ${new Date().toLocaleTimeString("it-IT")}`
        : `${currentDate}`;

      await conn
        .query(
          `
                        UPDATE cardholders 
                        SET FirstName = ?, LastName = ?, IdentNumber = ?, PrivateNumber = ?, BirthDate = ?, Gender = ?, PhoneNumber = ?, Email = ?, Photo = ?
                        WHERE cardholders.CardHolderID = ${u.CardHolderID}

                `,
          [
            u.FirstName,
            u.LastName,
            u.IdentNumber,
            u.PrivateNumber,
            new Date(u.BirthDate)
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-"),
            u.Gender === "true" || u.Gender === true ? true : false,
            u.PhoneNumber,
            u.Email,
            PhotoPath,
          ]
        )
        .then(async (r) => {
          const holderCard = await conn.query(
            `SELECT * FROM cards Where cards.CardHolderID = ?`,
            [u.CardHolderID]
          );
          if (holderCard?.length === 0) {
            await conn.query(
              `
                            INSERT INTO cards(CardUID, DeactivationDate, ActivationStatus, ActivationDate, CardHolderID) VALUES(?, ?, ?, ?, ?);
                        `,
              [
                u.CardUID,
                deactivationDate,
                u.ActivationStatus ? 1 : 0,
                currentDate,
                u.CardHolderID,
              ]
            );
          } else {
            await conn.query(
              `
                        UPDATE cards SET CardUID = ?, DeactivationDate = ?, ActivationStatus = ?
                        WHERE cards.CardHolderID = ${u.CardHolderID}
                    `,
              [u.CardUID, deactivationDate, u.ActivationStatus]
            );
          }
        });

      // const holder = await conn.query(`SELECT * FROM get_card_holders WHERE JSON_CONTAINS(holders, '{"CardHolderID": ${u.CardHolderID}}')`);

      res.send({
        message: "ინფორმაცია წარმატებით განახლდა",
        status: "success",
        // holder: holder[0].holders[0][0]
      });
    } else {
      res.send({
        message: "შეავსეთ ყველა სავალდებულო ველი",
        status: "error",
      });
    }
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.close();
  }
};

export const getAbsenceReasons = async (req, res) => {
  let conn;

  try {
    conn = await createConnection();

    const getAbsenceReason = await conn.query(
      `SELECT ConditionalNotationID, ConditionalNotationName  FROM ostiumconfigdb.conditionalnotations`
    );

    res.send(getAbsenceReason);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const addAbsenceDate = async (req, res) => {
  let conn;

  const { absenceReasonId, startDate, endDate, cardUId } = req.body;

  try {
    conn = await createConnection();

    let query = `SELECT COUNT(*) AS count 
       FROM ostiumconfigdb.absence_reason 
       WHERE card_uid = ? 
       AND (
           (start_date <= ? AND end_date >= ?) 
           OR (start_date <= ? AND end_date >= ?) 
           OR (? <= start_date AND ? >= end_date)
      )`;

    const [existingDays] = await conn.query(query, [
      cardUId,
      startDate,
      startDate,
      endDate,
      endDate,
      startDate,
      endDate,
    ]);

    if (existingDays.count > 0) {
      res.send({
        message: "დასვენების დღეები უკვე დარეგისტრირებულია",
        status: "error",
      });
      return;
    }

    await conn
      .query(
        `INSERT INTO ostiumconfigdb.absence_reason (card_uid, ConditionalNotationID, start_date, end_date) 
      VALUES  (?, ?, ?, ?)`,
        [cardUId, absenceReasonId, startDate, endDate]
      )
      .then((resp) => {
        let status = {
          status: "success",
          message: "ინფორმაცია წარმატებით განახლდა",
        };
        res.send(status);
      })
      .catch((err) => {
        console.log(err);
        res.send({
          message: "ინფორმაცია ვერ განახლდა",
          status: "error",
        });
      });
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const getAbsenceDays = async (req, res) => {
  let conn;

  const { cardUId } = req.params;

  try {
    conn = await createConnection();

    const AbsenceDays = await conn.query(
      `SELECT 
    ar.ar_id AS arID,
    ar.card_uid AS cardUId,
    DATE_FORMAT(ar.start_date, '%Y:%m:%d') AS startDate,
    DATE_FORMAT(ar.end_date, '%Y:%m:%d') As endDate,
    cn.ConditionalNotationID AS absenceReasonId,
    cn.ConditionalNotationName AS absenceReasonName
  FROM ostiumconfigdb.absence_reason ar
  JOIN ostiumconfigdb.conditionalnotations cn 
    ON ar.ConditionalNotationID = cn.ConditionalNotationID
  WHERE ar.card_uid = ? AND NOW() <= ar.end_date`,
      [cardUId]
    );

    res.send(AbsenceDays);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const deleteAbsenceDays = async (req, res) => {
  let conn;
  const { id } = req.params;

  try {
    conn = await createConnection();

    // Execute the delete query
    const result = await conn.query(
      `DELETE FROM ostiumconfigdb.absence_reason ar 
       WHERE ar.ar_id = ? AND ar.start_date > NOW()`,
      [id]
    );

    // Check if any rows were affected
    if (result.affectedRows > 0) {
      res.send({
        status: "success",
        message: "ინფორმაცია წარმატებით წაიშალა",
      });
    } else {
      res.send({
        status: "error",
        message: "ინფორმაცია ვერ ვერ წაშლილია",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: "დაფიქსირდა შეცდომა სერვერზე",
    });
  } finally {
    if (conn) conn.end();
  }
};

export const searcHolder = async (req, res) => {
  let conn;

  const q = req.query.q;
  const page = parseInt(req.query.page);
  const itemsperpage = parseInt(req.query.itemsperpage);

  try {
    conn = await createConnection();
    const holders = await conn.query(`CALL SearchHolder(?, ?, ?)`, [
      q,
      (page - 1) * itemsperpage,
      itemsperpage,
    ]);

    // const holders = await conn.query(`
    //     SELECT DISTINCT ch.CardHolderID, FirstName, LastName, PrivateNumber, IdentNumber, PhoneNumber, Email, BirthDate, PurchaseType,
    //     Gender, Photo, c.CardID, CardUID, ActivationDate, DeactivationDate, ActivationStatus,
    //     (SELECT
    //         JSON_OBJECT(
    //             'Id', tzg2.Id,
    //             'groupName', tzg2.groupName,
    //             'timezone_plan', (
    //                 SELECT JSON_ARRAYAGG(
    //                     JSON_OBJECT(
    //                         'Id', tzp.Id,
    //                         'startTime', tzp.startTime,
    //                         'endTime', tzp.endTime,
    //                         'breakAnytime', IF(tzp.breakAnytime = 1, 1, 0),
    //                         'breakTimes', tzp.breakTimes,
    //                         'weekDays', (
    //                             SELECT JSON_ARRAYAGG(
    //                                 JSON_OBJECT(
    //                                     'Id', wd.Id,
    //                                     'dayName', wd.dayName,
    //                                     'dayNumber', wd.dayNumber
    //                                 )
    //                             )
    //                             FROM weekdays_timezone_plan wdtzp
    //                             LEFT JOIN weekdays wd ON wdtzp.weekday_id = wd.Id
    //                             WHERE wdtzp.timezone_plan_id = tzp.Id
    //                         )
    //                     )
    //                 ) AS timezone_plan
    //                 FROM timezone_plan tzp
    //                 WHERE tzp.timezone_group_id = tzg.Id
    //             )
    //         )
    //         FROM timezone_group tzg2
    //         JOIN card_timezone ctz ON tzg2.Id = ctz.TimezoneID
    //         WHERE ctz.CardID = c.CardID
    //         AND ctz.AccessEndDate IS NULL
    //     ) as WorkingDays

    //     FROM CardHolders ch
    //     LEFT JOIN Cards c ON ch.CardHolderID = c.CardHolderID
    //     LEFT JOIN card_timezone ct ON c.CardID = ct.CardID
    //     LEFT JOIN timezone_group tzg ON ct.TimezoneID = tzg.Id
    //     WHERE CONCAT_WS(' ', FirstName, LastName, PrivateNumber, CardUID, Email, PhoneNumber) LIKE CONCAT('%', ?, '%')
    //     GROUP BY ch.CardHolderID
    //     OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
    // `, [q, page < 2 ? 0 : page * itemsperpage, itemsperpage]);

    // const logCount = (await conn.query(`
    //     SELECT DISTINCT COUNT(ch.CardHolderID) AS logCount
    //     FROM CardHolders ch
    //     JOIN Cards c ON ch.CardHolderID = c.CardHolderID
    //     WHERE CONCAT_WS(' ', FirstName, LastName, PrivateNumber, CardUID, Email, PhoneNumber) LIKE CONCAT('%', ?, '%')
    //     `, [q]))[0].logCount;

    // console.log(holders[1][0].logCount);
    const lc = Math.ceil(holders[1][0].logCount / itemsperpage);

    res.send({ holders: holders[0], logCount: lc });
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};
