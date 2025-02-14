import express from "express";
import {
  addTimeZone,
  deleteTimezone,
  editHolderTimezones,
  editTimezone,
  getHolderDefinedTimezones,
  getNessesaryData,
  getTimezones,
  getWeekDays,
  registerCardHolder,
  registerHolderFromXLSX,
  searcHolder,
  updateCardHolder,
  getAbsenceReasons,
  addAbsenceDate,
  getAbsenceDays,
  deleteAbsenceDays,
} from "../controllers/CardHolderController.js";
import { getDashboardStatistic } from "../controllers/CardHolderLOGController.js";
const CardHolderRoute = express.Router();

CardHolderRoute.get("/weekdays", getWeekDays);

CardHolderRoute.post("/registerch", registerCardHolder);
CardHolderRoute.post("/registerfromxlsx", registerHolderFromXLSX);
CardHolderRoute.get("/nessesarydata", getNessesaryData);
CardHolderRoute.get(
  "/holderdefinedtimezones/:cardId",
  getHolderDefinedTimezones
);
CardHolderRoute.put("/editholdertimezone", editHolderTimezones);
CardHolderRoute.put("/edittimezone", editTimezone);
CardHolderRoute.delete("/deletetimezone/:id", deleteTimezone);
CardHolderRoute.get("/timezones", getTimezones);
CardHolderRoute.post("/timezone", addTimeZone);
CardHolderRoute.put("/updatech", updateCardHolder);
CardHolderRoute.get("/searchch", searcHolder);

CardHolderRoute.get("/dashboardstatistic", getDashboardStatistic);

CardHolderRoute.get("/getAbsenceReasons", getAbsenceReasons);
CardHolderRoute.post("/addAbsenceDate", addAbsenceDate);
CardHolderRoute.get("/getAbsenceDays/:cardUId", getAbsenceDays);
CardHolderRoute.delete("/deleteAbsenceDays/:id", deleteAbsenceDays);

export default CardHolderRoute;
