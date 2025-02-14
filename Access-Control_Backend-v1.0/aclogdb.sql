-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.9.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ostiumlogdb
DROP DATABASE IF EXISTS `ostiumlogdb`;
CREATE DATABASE IF NOT EXISTS `ostiumlogdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `ostiumlogdb`;

-- Dumping structure for table ostiumlogdb.errorlogs
DROP TABLE IF EXISTS `errorlogs`;
CREATE TABLE IF NOT EXISTS `errorlogs` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CardUID` varchar(50) NOT NULL DEFAULT 'NULL',
  `EventTime` varchar(50) NOT NULL DEFAULT 'NULL',
  `Direction` bit(1) DEFAULT NULL,
  `ConnectionTime` datetime NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table ostiumlogdb.logs
DROP TABLE IF EXISTS `logs`;
CREATE TABLE IF NOT EXISTS `logs` (
  `LogID` int(11) NOT NULL AUTO_INCREMENT,
  `CardUID` varchar(50) DEFAULT NULL,
  `EventTime` datetime DEFAULT NULL,
  `Direction` bit(1) DEFAULT NULL,
  `TimeInterval` int(11) DEFAULT NULL,
  `Comment` longtext DEFAULT NULL,
  PRIMARY KEY (`LogID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for procedure ostiumlogdb.GetDashboardStatistic
DROP PROCEDURE IF EXISTS `GetDashboardStatistic`;
DELIMITER //
CREATE PROCEDURE `GetDashboardStatistic`()
BEGIN
	WITH traki AS (
		SELECT * FROM ostiumlogdb.`logs` l
		WHERE l.Direction = 1
		AND DATE_FORMAT(l.EventTime, '%Y-%m-%d') = '2024-06-15'
		GROUP BY l.CardUID
		ORDER BY l.EventTime ASC
	)
	SELECT
		COUNT(DISTINCT l.CardUID) AS tardinessEmpCount,
		JSON_ARRAYAGG(
			DISTINCT JSON_OBJECT(
				'CardID', c.CardID,
				'CardUID', c.CardUID,
				'CardHolderID', ch.CardHolderID,
				'FirstName', ch.FirstName,
				'LastName', ch.LastName,
				'PhoneNumber', ch.PhoneNumber,
				'Email', ch.Email
			)
		) AS empList
		
	FROM traki l
	JOIN ostiumconfigdb.cards c ON l.CardUID = c.CardUID
	JOIN ostiumconfigdb.cardholders ch ON c.CardHolderID = ch.CardHolderID
	JOIN ostiumconfigdb.card_timezone ct ON c.CardID = ct.CardID
	JOIN ostiumconfigdb.timezone_group tg ON ct.TimezoneID = tg.Id
	JOIN ostiumconfigdb.timezone_plan tp ON tg.Id = tp.timezone_group_id
	JOIN ostiumconfigdb.weekdays_timezone_plan wtp ON tp.Id = wtp.timezone_plan_id
	JOIN ostiumconfigdb.weekdays wd ON wtp.weekday_id = wd.Id
	
	WHERE WEEKDAY(l.EventTime) = wd.dayNumber
	AND DATE_FORMAT(l.EventTime, '%H:%i:%s') > tp.startTime;
	
	WITH traki AS (
		SELECT *,
		LEAD(l.Direction, 1) OVER(PARTITION BY l.CardUID ORDER BY l.EventTime ASC) AS nextDirection
		FROM ostiumlogdb.`logs` l
		WHERE DATE_FORMAT(l.EventTime, '%Y-%m-%d') = '2024-06-14'
	)
	SELECT
		COUNT(DISTINCT l.CardUID) AS earlyLeaveEmpCount,
		JSON_ARRAYAGG(
			JSON_OBJECT(
				'CardID', c.CardID,
				'CardUID', c.CardUID,
				'CardHolderID', ch.CardHolderID,
				'FirstName', ch.FirstName,
				'LastName', ch.LastName,
				'PhoneNumber', ch.PhoneNumber,
				'Email', ch.Email
			)
		) AS empList
		
	FROM traki l
	JOIN ostiumconfigdb.cards c ON l.CardUID = c.CardUID
	JOIN ostiumconfigdb.cardholders ch ON c.CardHolderID = ch.CardHolderID
	JOIN ostiumconfigdb.card_timezone ct ON c.CardID = ct.CardID
	JOIN ostiumconfigdb.timezone_group tg ON ct.TimezoneID = tg.Id
	JOIN ostiumconfigdb.timezone_plan tp ON tg.Id = tp.timezone_group_id
	JOIN ostiumconfigdb.weekdays_timezone_plan wtp ON tp.Id = wtp.timezone_plan_id
	JOIN ostiumconfigdb.weekdays wd ON wtp.weekday_id = wd.Id
	
	WHERE WEEKDAY(l.EventTime) = wd.dayNumber
	AND TIME_FORMAT(l.EventTime, '%H:%i:%s') < tp.endTime
	AND l.Direction = 0
	AND l.nextDirection IS NULL
	ORDER BY l.EventTime ASC;


	WITH traki AS (
		SELECT *
		FROM ostiumlogdb.`logs` l
		WHERE DATE_FORMAT(l.EventTime, '%Y-%m-%d') = '2024-06-14'
	)
	SELECT
		COUNT(DISTINCT c.CardUID) AS notIncomedCount,
		JSON_ARRAYAGG(
			DISTINCT JSON_OBJECT(
				'CardID', c.CardID,
				'CardUID', c.CardUID,
				'CardHolderID', ch.CardHolderID,
				'FirstName', ch.FirstName,
				'LastName', ch.LastName,
				'PhoneNumber', ch.PhoneNumber,
				'Email', ch.Email
			)
		) AS empList
		
	FROM `traki` l
	RIGHT JOIN ostiumconfigdb.cards c ON l.CardUID = c.CardUID
	JOIN ostiumconfigdb.cardholders ch ON c.CardHolderID = ch.CardHolderID
	JOIN ostiumconfigdb.card_timezone ct ON c.CardID = ct.CardID
	JOIN ostiumconfigdb.timezone_group tg ON ct.TimezoneID = tg.Id
	JOIN ostiumconfigdb.timezone_plan tp ON tg.Id = tp.timezone_group_id
	JOIN ostiumconfigdb.weekdays_timezone_plan wtp ON tp.Id = wtp.timezone_plan_id
	JOIN ostiumconfigdb.weekdays wd ON wtp.weekday_id = wd.Id
	
	WHERE l.EventTime IS NULL 
	
	ORDER BY c.CardID ASC;
	
	
	WITH traki AS (
		SELECT *
		FROM ostiumlogdb.`logs` l
		WHERE DATE_FORMAT(l.EventTime, '%Y-%m-%d') = '2024-06-14'
	)
	SELECT
		COUNT(DISTINCT c.CardUID) AS IncomedCount,
		JSON_ARRAYAGG(
			DISTINCT JSON_OBJECT(
				'CardID', c.CardID,
				'CardUID', c.CardUID,
				'CardHolderID', ch.CardHolderID,
				'FirstName', ch.FirstName,
				'LastName', ch.LastName,
				'PhoneNumber', ch.PhoneNumber,
				'Email', ch.Email
			)
		) AS empList
		
	FROM `traki` l
	RIGHT JOIN ostiumconfigdb.cards c ON l.CardUID = c.CardUID
	JOIN ostiumconfigdb.cardholders ch ON c.CardHolderID = ch.CardHolderID
	JOIN ostiumconfigdb.card_timezone ct ON c.CardID = ct.CardID
	JOIN ostiumconfigdb.timezone_group tg ON ct.TimezoneID = tg.Id
	JOIN ostiumconfigdb.timezone_plan tp ON tg.Id = tp.timezone_group_id
	JOIN ostiumconfigdb.weekdays_timezone_plan wtp ON tp.Id = wtp.timezone_plan_id
	JOIN ostiumconfigdb.weekdays wd ON wtp.weekday_id = wd.Id
	
	WHERE l.EventTime IS NOT NULL 
	
	ORDER BY c.CardID ASC;
END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
