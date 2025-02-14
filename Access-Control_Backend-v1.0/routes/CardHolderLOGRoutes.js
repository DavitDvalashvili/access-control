import express from "express";
import {
  accessCard,
  getCardHolders,
  getControllerIP,
  getCurrentEvent,
  getEventMonitor,
  getIP,
  getNonOutcomedCards,
  getReports,
  getWorkTimeAccounting,
  handleEndOutcome,
  saveOfflineCards,
  saveReportComment,
  setIP,
  workTimePlan,
  getReport,
} from "../controllers/CardHolderLOGController.js";
import { getErrorlogs } from "../controllers/CardHolderLOGController.js";

const CardHolderLOGRoutes = express.Router();

CardHolderLOGRoutes.get("/getholders", getCardHolders);
CardHolderLOGRoutes.get("/eventmonitor", getEventMonitor);
CardHolderLOGRoutes.get("/reports", getReports);
CardHolderLOGRoutes.get("/currentevent", getCurrentEvent);
CardHolderLOGRoutes.get("/worktimeaccounting", getWorkTimeAccounting);
CardHolderLOGRoutes.get("/worktimeplan", workTimePlan);
CardHolderLOGRoutes.put("/savereportcomment", saveReportComment);

CardHolderLOGRoutes.get("/accesscard", accessCard);

CardHolderLOGRoutes.get("/getip", getIP);
CardHolderLOGRoutes.post("/setip", setIP);

CardHolderLOGRoutes.get("/getcontrollerip", getControllerIP);

CardHolderLOGRoutes.get("/saveofflinecards", saveOfflineCards);

CardHolderLOGRoutes.get("/nonoutcomedcards", getNonOutcomedCards);
CardHolderLOGRoutes.post("/handleendoutcome", handleEndOutcome);

CardHolderLOGRoutes.get("/errorlogs", getErrorlogs);

CardHolderLOGRoutes.get("/report", getReport);

export default CardHolderLOGRoutes;
