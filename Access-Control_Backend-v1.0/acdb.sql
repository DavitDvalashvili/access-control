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


-- Dumping database structure for ostiumconfigdb
DROP DATABASE IF EXISTS `ostiumconfigdb`;
CREATE DATABASE IF NOT EXISTS `ostiumconfigdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `ostiumconfigdb`;

-- Dumping structure for table ostiumconfigdb.cardholders
DROP TABLE IF EXISTS `cardholders`;
CREATE TABLE IF NOT EXISTS `cardholders` (
  `CardHolderID` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `IdentNumber` varchar(50) DEFAULT NULL,
  `PrivateNumber` varchar(50) NOT NULL,
  `BirthDate` date DEFAULT NULL,
  `Gender` bit(1) DEFAULT NULL,
  `Photo` varchar(150) DEFAULT NULL,
  `PhoneNumber` varchar(50) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `RegistrationDate` datetime DEFAULT NULL,
  `PurchaseType` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`CardHolderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table ostiumconfigdb.cards
DROP TABLE IF EXISTS `cards`;
CREATE TABLE IF NOT EXISTS `cards` (
  `CardID` int(11) NOT NULL AUTO_INCREMENT,
  `CardUID` varchar(50) DEFAULT NULL,
  `ActivationStatus` bit(1) DEFAULT NULL,
  `ActivationDate` datetime DEFAULT NULL,
  `DeactivationDate` datetime DEFAULT NULL,
  `CardHolderID` int(11) DEFAULT NULL,
  `PacketId` int(11) DEFAULT NULL,
  `PacketName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`CardID`),
  KEY `FK_cards_cardholders` (`CardHolderID`),
  KEY `FK_cards_packets` (`PacketId`),
  CONSTRAINT `FK_cards_cardholders` FOREIGN KEY (`CardHolderID`) REFERENCES `cardholders` (`CardHolderID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_cards_packets` FOREIGN KEY (`PacketId`) REFERENCES `packets` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table ostiumconfigdb.card_timezone
DROP TABLE IF EXISTS `card_timezone`;
CREATE TABLE IF NOT EXISTS `card_timezone` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CardID` int(11) DEFAULT NULL,
  `TimezoneID` int(11) DEFAULT NULL,
  `AccessStartDate` datetime DEFAULT NULL,
  `AccessEndDate` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_cards_timezone_cards` (`CardID`) USING BTREE,
  KEY `FK_cards_timezone_timezone` (`TimezoneID`) USING BTREE,
  CONSTRAINT `FK_card_timezone_timezone_group` FOREIGN KEY (`TimezoneID`) REFERENCES `timezone_group` (`Id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_cards_timezone_cards` FOREIGN KEY (`CardID`) REFERENCES `cards` (`CardID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table ostiumconfigdb.controllerip
DROP TABLE IF EXISTS `controllerip`;
CREATE TABLE IF NOT EXISTS `controllerip` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Direction` int(11) DEFAULT NULL,
  `IP` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table ostiumconfigdb.packets
DROP TABLE IF EXISTS `packets`;
CREATE TABLE IF NOT EXISTS `packets` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `PacketName` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table ostiumconfigdb.timezone
DROP TABLE IF EXISTS `timezone`;
CREATE TABLE IF NOT EXISTS `timezone` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `weekDayId` int(11) DEFAULT NULL,
  `timezone_plan_id` int(11) DEFAULT NULL,
  `breakTime` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`breakTime`)),
  PRIMARY KEY (`Id`),
  KEY `FK_timezone_weekdays` (`weekDayId`),
  KEY `FK_timezone_timezone_plan` (`timezone_plan_id`),
  CONSTRAINT `FK_timezone_timezone_plan` FOREIGN KEY (`timezone_plan_id`) REFERENCES `timezone_plan` (`Id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_timezone_weekdays` FOREIGN KEY (`weekDayId`) REFERENCES `weekdays` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table ostiumconfigdb.timezone_group
DROP TABLE IF EXISTS `timezone_group`;
CREATE TABLE IF NOT EXISTS `timezone_group` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `groupName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table ostiumconfigdb.timezone_plan
DROP TABLE IF EXISTS `timezone_plan`;
CREATE TABLE IF NOT EXISTS `timezone_plan` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `breakAnytime` bit(1) NOT NULL DEFAULT bit_count(0),
  `timezone_group_id` int(11) DEFAULT NULL,
  `breakTimes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`breakTimes`)),
  PRIMARY KEY (`Id`),
  KEY `FK_timezone_plan_timezone_group` (`timezone_group_id`),
  CONSTRAINT `FK_timezone_plan_timezone_group` FOREIGN KEY (`timezone_group_id`) REFERENCES `timezone_group` (`Id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table ostiumconfigdb.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table ostiumconfigdb.weekdays
DROP TABLE IF EXISTS `weekdays`;
CREATE TABLE IF NOT EXISTS `weekdays` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `dayName` varchar(50) DEFAULT NULL,
  `dayNumber` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table ostiumconfigdb.weekdays_timezone_plan
DROP TABLE IF EXISTS `weekdays_timezone_plan`;
CREATE TABLE IF NOT EXISTS `weekdays_timezone_plan` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `weekday_id` int(11) DEFAULT NULL,
  `timezone_plan_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK__weekdays` (`weekday_id`),
  KEY `FK__timezone_plan` (`timezone_plan_id`),
  CONSTRAINT `FK__timezone_plan` FOREIGN KEY (`timezone_plan_id`) REFERENCES `timezone_plan` (`Id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK__weekdays` FOREIGN KEY (`weekday_id`) REFERENCES `weekdays` (`Id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for view ostiumconfigdb.get_card_holders
DROP VIEW IF EXISTS `get_card_holders`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `get_card_holders` (
	`CardHolderID` INT(11) NOT NULL,
	`FirstName` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`LastName` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`PrivateNumber` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`IdentNumber` VARCHAR(50) NULL COLLATE 'utf8mb4_general_ci',
	`PhoneNumber` VARCHAR(50) NULL COLLATE 'utf8mb4_general_ci',
	`Email` VARCHAR(100) NULL COLLATE 'utf8mb4_general_ci',
	`BirthDate` DATE NULL,
	`Gender` VARCHAR(5) NULL COLLATE 'utf8mb4_general_ci',
	`Photo` VARCHAR(150) NULL COLLATE 'utf8mb4_general_ci',
	`CardID` INT(11) NOT NULL,
	`CardUID` VARCHAR(50) NULL COLLATE 'utf8mb4_general_ci',
	`DeactivationDate` DATETIME NULL,
	`ActivationStatus` INT(2) NULL,
	`WorkingDays` MEDIUMTEXT NULL COLLATE 'utf8mb4_bin'
) ENGINE=MyISAM;

-- Dumping structure for view ostiumconfigdb.get_nonoutcomed_cards
DROP VIEW IF EXISTS `get_nonoutcomed_cards`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `get_nonoutcomed_cards` (
	`FirstName` VARCHAR(50) NULL COLLATE 'utf8mb4_general_ci',
	`LastName` VARCHAR(50) NULL COLLATE 'utf8mb4_general_ci',
	`CardUID` VARCHAR(50) NULL COLLATE 'utf8mb4_general_ci',
	`IncomeDay` VARCHAR(10) NULL COLLATE 'utf8mb4_general_ci',
	`StartTime` VARCHAR(13) NULL COLLATE 'utf8mb4_general_ci',
	`EndTime` VARCHAR(13) NULL COLLATE 'utf8mb4_general_ci',
	`Duration` TIME NULL
) ENGINE=MyISAM;

-- Dumping structure for view ostiumconfigdb.get_timezones
DROP VIEW IF EXISTS `get_timezones`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `get_timezones` (
	`Id` INT(11) NOT NULL,
	`groupName` VARCHAR(200) NULL COLLATE 'utf8mb4_general_ci',
	`timezone_plan` MEDIUMTEXT NULL COLLATE 'utf8mb4_bin'
) ENGINE=MyISAM;

-- Dumping structure for procedure ostiumconfigdb.GetDashboardStatistic
DROP PROCEDURE IF EXISTS `GetDashboardStatistic`;
DELIMITER //
CREATE PROCEDURE `GetDashboardStatistic`()
BEGIN
    -- Tardiness employees
    WITH tardiness AS (
        SELECT 
            l.CardUID,
            MIN(l.EventTime) AS firstEventTime
        FROM ostiumlogdb.logs l
        WHERE l.Direction = 1
        AND DATE(l.EventTime) = '2024-06-14'
        GROUP BY l.CardUID
    ),
    timezone_data AS (
        SELECT 
            ct.CardID,
            tp.startTime,
            tp.endTime,
            wd.dayNumber
        FROM ostiumconfigdb.card_timezone ct
        JOIN ostiumconfigdb.timezone_group tg ON ct.TimezoneID = tg.Id
        JOIN ostiumconfigdb.timezone_plan tp ON tg.Id = tp.timezone_group_id
        JOIN ostiumconfigdb.weekdays_timezone_plan wtp ON tp.Id = wtp.timezone_plan_id
        JOIN ostiumconfigdb.weekdays wd ON wtp.weekday_id = wd.Id
    )

    -- Query 1: Tardiness Employees
    SELECT
        COUNT(DISTINCT c.CardUID) AS tardinessEmpCount,
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
    FROM tardiness t
    JOIN ostiumconfigdb.cards c ON t.CardUID = c.CardUID
    JOIN ostiumconfigdb.cardholders ch ON c.CardHolderID = ch.CardHolderID
    JOIN timezone_data td ON c.CardID = td.CardID
    WHERE WEEKDAY(t.firstEventTime) = td.dayNumber
    AND TIME(t.firstEventTime) > td.startTime;

    -- Query 2: Early Leave Employees
    
    WITH early_leave AS (
        SELECT 
            l.CardUID,
            MIN(l.EventTime) AS firstEventTime,
            LEAD(l.Direction, 1) OVER(PARTITION BY l.CardUID ORDER BY l.EventTime ASC) AS nextDirection
        FROM ostiumlogdb.logs l
        WHERE DATE(l.EventTime) = '2024-06-14'
    ),
    
    timezone_data AS (
        SELECT 
            ct.CardID,
            tp.startTime,
            tp.endTime,
            wd.dayNumber
        FROM ostiumconfigdb.card_timezone ct
        JOIN ostiumconfigdb.timezone_group tg ON ct.TimezoneID = tg.Id
        JOIN ostiumconfigdb.timezone_plan tp ON tg.Id = tp.timezone_group_id
        JOIN ostiumconfigdb.weekdays_timezone_plan wtp ON tp.Id = wtp.timezone_plan_id
        JOIN ostiumconfigdb.weekdays wd ON wtp.weekday_id = wd.Id
    )
    
    SELECT
        COUNT(DISTINCT c.CardUID) AS earlyLeaveEmpCount,
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
    FROM early_leave el
    JOIN ostiumconfigdb.cards c ON el.CardUID = c.CardUID
    JOIN ostiumconfigdb.cardholders ch ON c.CardHolderID = ch.CardHolderID
    JOIN timezone_data td ON c.CardID = td.CardID
    WHERE WEEKDAY(el.firstEventTime) = td.dayNumber
    AND TIME(el.firstEventTime) < td.endTime
    AND el.nextDirection IS NULL;

    -- Query 3: Not Incomed Employees
    
    with not_incomed AS (
        SELECT 
            c.CardUID
        FROM ostiumconfigdb.cards c
        LEFT JOIN ostiumlogdb.logs l ON c.CardUID = l.CardUID AND DATE(l.EventTime) = '2024-06-14'
        WHERE l.EventTime IS NULL
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
    FROM not_incomed ni
    JOIN ostiumconfigdb.cards c ON ni.CardUID = c.CardUID
    JOIN ostiumconfigdb.cardholders ch ON c.CardHolderID = ch.CardHolderID;

    -- Query 4: Incomed Employees
    
    WITH incomed AS (
        SELECT 
            c.CardUID
        FROM ostiumconfigdb.cards c
        JOIN ostiumlogdb.logs l ON c.CardUID = l.CardUID AND DATE(l.EventTime) = '2024-06-14'
        WHERE l.EventTime IS NOT NULL
    )
    
    SELECT
        COUNT(DISTINCT c.CardUID) AS incomedCount,
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
    FROM incomed i
    JOIN ostiumconfigdb.cards c ON i.CardUID = c.CardUID
    JOIN ostiumconfigdb.cardholders ch ON c.CardHolderID = ch.CardHolderID;
    
END//
DELIMITER ;

-- Dumping structure for procedure ostiumconfigdb.GetReports
DROP PROCEDURE IF EXISTS `GetReports`;
DELIMITER //
CREATE PROCEDURE `GetReports`(
	IN `_ids` VARCHAR(255),
	IN `_mindate` DATE,
	IN `_maxdate` DATE,
	IN `_page` INT,
	IN `_itemsperpage` INT
)
BEGIN
	-- Subquery to precompute StartTime and EndTime for each CardUID and Event Date
	WITH MinMaxTimes AS (
		SELECT 
			L.CardUID,
			DATE_FORMAT(L.EventTime, '%Y/%m/%d') AS IncomeDay,
			MIN(DATE_FORMAT(L.EventTime, '%H:%i:%s')) AS StartTime,
			MAX(DATE_FORMAT(L.EventTime, '%H:%i:%s')) AS EndTime
		FROM ostiumlogdb.logs L
		WHERE L.Direction = 1 OR L.Direction = 0
		GROUP BY L.CardUID, DATE_FORMAT(L.EventTime, '%Y/%m/%d')
	),
	
	-- Filter out only the valid records with both StartTime and EndTime
	FilteredTimes AS (
		SELECT 
			MMT.CardUID,
			MMT.IncomeDay,
			MMT.StartTime,
			MMT.EndTime
		FROM MinMaxTimes MMT
		WHERE MMT.StartTime IS NOT NULL AND MMT.EndTime IS NOT NULL
	)
	
	SELECT 
		CH.FirstName, 
		CH.LastName, 
		FT.CardUID,
		FT.IncomeDay,
		FT.StartTime,
		FT.EndTime,
		TIME_FORMAT(
			TIMEDIFF(
				IF(FT.EndTime IS NOT NULL, FT.EndTime, DATE_FORMAT(NOW(), '%H:%i:%s')),
				FT.StartTime
			),
			'%H:%i:%s'
		) AS Duration
	FROM FilteredTimes FT
	JOIN ostiumconfigdb.cards C ON FT.CardUID = C.CardUID
	JOIN ostiumconfigdb.cardholders CH ON C.CardHolderID = CH.CardHolderID
	WHERE CH.CardHolderID IN (_ids)
	AND FT.IncomeDay >= _mindate AND FT.IncomeDay <= _maxdate
	GROUP BY FT.IncomeDay, CH.CardHolderID
	ORDER BY FT.IncomeDay ASC
	OFFSET _page ROWS FETCH NEXT _itemsperpage ROWS ONLY;

	-- Optimized count query
	
	-- Subquery to precompute StartTime and EndTime for each CardUID and Event Date
	WITH MinMaxTimes AS (
		SELECT 
			L.CardUID,
			DATE_FORMAT(L.EventTime, '%Y/%m/%d') AS IncomeDay,
			MIN(DATE_FORMAT(L.EventTime, '%H:%i:%s')) AS StartTime,
			MAX(DATE_FORMAT(L.EventTime, '%H:%i:%s')) AS EndTime
		FROM ostiumlogdb.logs L
		WHERE L.Direction = 1 OR L.Direction = 0
		GROUP BY L.CardUID, DATE_FORMAT(L.EventTime, '%Y/%m/%d')
	),
	
	-- Filter out only the valid records with both StartTime and EndTime
	FilteredTimes AS (
		SELECT 
			MMT.CardUID,
			MMT.IncomeDay,
			MMT.StartTime,
			MMT.EndTime
		FROM MinMaxTimes MMT
		WHERE MMT.StartTime IS NOT NULL AND MMT.EndTime IS NOT NULL
	)
	
	
	SELECT COUNT(DISTINCT FT.IncomeDay) AS logCount
	FROM FilteredTimes FT
	JOIN ostiumconfigdb.cards C ON FT.CardUID = C.CardUID
	JOIN ostiumconfigdb.cardholders CH ON C.CardHolderID = CH.CardHolderID
	WHERE CH.CardHolderID IN (_ids)
	AND FT.IncomeDay >= _mindate
	AND FT.IncomeDay <= _maxdate;
END//
DELIMITER ;

-- Dumping structure for procedure ostiumconfigdb.GetWorktimePlan
DROP PROCEDURE IF EXISTS `GetWorktimePlan`;
DELIMITER //
CREATE PROCEDURE `GetWorktimePlan`(
	IN `_ids` VARCHAR(255),
	IN `_mindate` DATE,
	IN `_maxdate` DATE,
	IN `_page` INT,
	IN `_itemsperpage` INT
)
BEGIN
    SELECT DISTINCT ch.CardHolderID, ch.FirstName, ch.LastName, chl.CardUID, chl.LogID, tz.Id AS TimeZoneID, 
    DATE_FORMAT(chl.EventTime, '%Y/%m/%d') as entranceDate, `Comment`,
    (SELECT JSON_NORMALIZE(GetIncomeTime_wp(chl.CardUID, tz.startTime, chl.EventTime, ct.AccessStartDate, ct.AccessEndDate))) AS incomeTime,
    (SELECT JSON_NORMALIZE(GetOutcomeTime_wp(chl.CardUID, tz.endTime, chl.EventTime, ct.AccessStartDate, ct.AccessEndDate))) AS outcomeTime,

    JSON_OBJECT(
		'dayName', wd.dayName,
		'dayNumber', wd.dayNumber,
		'startTime', TIME_FORMAT(tz.startTime, '%H:%i'),
		'endTime', TIME_FORMAT(tz.endTime, '%H:%i'),
    	'totalWorkTimePlan', TIME_FORMAT(
								TIMEDIFF(
									TIMEDIFF(tz.endTime, tz.startTime),
        							IF(JSON_LENGTH(tz.breakTimes) > 0,
                						(SELECT TIME_FORMAT(
											SEC_TO_TIME(
												SUM(TIME_TO_SEC(TIMEDIFF(jt.endTime, jt.startTime)))
											),
											'%H:%i:%s'
										)
                						FROM JSON_TABLE(tz.breakTimes, '$[*]' COLUMNS (startTime VARCHAR(255) PATH '$.startTime', endTime VARCHAR(255) PATH '$.endTime')) AS jt
                						GROUP BY breakTimes),
										('00:00:00')
        							)
    							), '%H:%i'
		),
    	'totalWorkedTime', TIME_FORMAT(
								TIMEDIFF(
							        IF((SELECT GetTotalWorkTimeIncome_wp(chl.CardUID, chl.EventTime, ct.AccessStartDate, ct.AccessEndDate)) IS NOT NULL,
										(SELECT GetTotalWorkTimeIncome_wp(chl.CardUID, chl.EventTime, ct.AccessStartDate, ct.AccessEndDate)),
										NOW()
									),
									(SELECT GetTotalWorkTimeOutcome_wp(chl.CardUID, chl.EventTime, ct.AccessStartDate, ct.AccessEndDate))
							    ),
								'%H:%i:%s'
		),
	    'breakTime', (
	        SELECT JSON_ARRAYAGG(
				JSON_OBJECT(
					'startTime', startTime,
					'endTime', endTime,
					'difference', TIME_FORMAT(TIMEDIFF(endTime, startTime), '%H:%i')
				)
			)
	        FROM JSON_TABLE(tz.breakTimes, '$[*]' COLUMNS (startTime VARCHAR(255) PATH '$.startTime', endTime VARCHAR(255) PATH '$.endTime')) AS jt
	        GROUP BY tz.breakTimes
	    )
    ) AS WorkingDay,

    (
        SELECT TIME_FORMAT(
			SEC_TO_TIME(
				SUM(
					TIME_TO_SEC(
						TIMEDIFF(jt.endTime, jt.startTime)
					)
				)
			),
			'%H:%i'
		)
        FROM JSON_TABLE(tz.breakTimes, '$[*]' COLUMNS (startTime VARCHAR(255) PATH '$.startTime', endTime VARCHAR(255) PATH '$.endTime')) AS jt
        GROUP BY tz.breakTimes
    ) AS totalBreakTime

    FROM ostiumlogdb.logs chl
    JOIN ostiumconfigdb.cards c ON chl.CardUID = c.CardUID
    JOIN ostiumconfigdb.cardholders ch ON c.CardHolderID = ch.CardHolderID
    JOIN ostiumconfigdb.card_timezone ct ON c.CardID = ct.CardID
    JOIN ostiumconfigdb.timezone_group tzg ON ct.TimezoneID = tzg.Id
    JOIN ostiumconfigdb.timezone_plan tz ON tzg.Id = tz.timezone_group_id
    JOIN ostiumconfigdb.weekdays_timezone_plan wtzp ON tz.Id = wtzp.timezone_plan_id
    JOIN ostiumconfigdb.weekdays wd ON wtzp.weekday_id = wd.Id
    WHERE ch.CardHolderID IN (_ids) AND WEEKDAY(chl.EventTime) = wd.dayNumber
    AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') >= _mindate AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') <= _maxdate
    AND chl.EventTime BETWEEN ct.AccessStartDate AND IF(ct.AccessEndDate IS NOT NULL, ct.AccessEndDate, NOW())
    GROUP BY entranceDate, ch.CardHolderID, ct.AccessStartDate
    ORDER BY chl.EventTime
    OFFSET _page ROWS FETCH NEXT _itemsperpage ROWS ONLY;
END//
DELIMITER ;

-- Dumping structure for procedure ostiumconfigdb.myProcedure
DROP PROCEDURE IF EXISTS `myProcedure`;
DELIMITER //
CREATE PROCEDURE `myProcedure`()
BEGIN
		DECLARE c INT;
		SET c = 79;
		FOR i IN 1666..2033
			DO
				INSERT INTO cards (CardUID, ActivationStatus, ActivationDate, DeactivationDate, CardHolderID, PacketName)
				VALUES(
					CONCAT(FLOOR(100 + (RAND() * 400)), '-', FLOOR(10000 + (RAND() * 50000))),
					1,
					DATE_FORMAT(NOW(), '%Y-%m-%d'),
					DATE_FORMAT(
						FROM_UNIXTIME(
							UNIX_TIMESTAMP(NOW()) + (365 * 24 * 60 * 60)
						), '%Y-%m-%d'),
						i,
						'12'
				);
			END FOR;
		SELECT * FROM cards;
	END//
DELIMITER ;

-- Dumping structure for procedure ostiumconfigdb.SearchHolder
DROP PROCEDURE IF EXISTS `SearchHolder`;
DELIMITER //
CREATE PROCEDURE `SearchHolder`(
	IN `_query` VARCHAR(255),
	IN `_page` INT,
	IN `_itemsperpage` INT
)
BEGIN
	SELECT DISTINCT ch.CardHolderID, FirstName, LastName, PrivateNumber, IdentNumber, PhoneNumber, Email, BirthDate, PurchaseType,
        Gender, Photo, c.CardID, CardUID, ActivationDate, DeactivationDate, ActivationStatus,
        (SELECT
            JSON_OBJECT(
                'Id', tzg2.Id,
                'groupName', tzg2.groupName,
                'timezone_plan', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'Id', tzp.Id,
                            'startTime', tzp.startTime,
                            'endTime', tzp.endTime,
                            'breakAnytime', IF(tzp.breakAnytime = 1, 1, 0),
                            'breakTimes', tzp.breakTimes,
                            'weekDays', (
                                SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                        'Id', wd.Id,
                                        'dayName', wd.dayName,
                                        'dayNumber', wd.dayNumber
                                    )
                                )
                                FROM weekdays_timezone_plan wdtzp
                                LEFT JOIN weekdays wd ON wdtzp.weekday_id = wd.Id
                                WHERE wdtzp.timezone_plan_id = tzp.Id
                            )
                        )
                    ) AS timezone_plan
                    FROM timezone_plan tzp
                    WHERE tzp.timezone_group_id = tzg2.Id
                )
            )
            FROM timezone_group tzg2
            JOIN card_timezone ctz ON tzg2.Id = ctz.TimezoneID
            WHERE ctz.CardID = c.CardID
            AND ctz.AccessEndDate IS NULL
        ) as WorkingDays
    FROM CardHolders ch
    LEFT JOIN Cards c ON ch.CardHolderID = c.CardHolderID
    LEFT JOIN card_timezone ct ON c.CardID = ct.CardID
    LEFT JOIN timezone_group tzg ON ct.TimezoneID = tzg.Id
    WHERE CONCAT_WS(' ', FirstName, LastName, PrivateNumber, CardUID, Email, PhoneNumber) LIKE CONCAT('%', _query, '%')
    GROUP BY ch.CardHolderID
    OFFSET _page ROWS FETCH NEXT _itemsperpage ROWS ONLY;
    
    SELECT DISTINCT COUNT(ch.CardHolderID) AS logCount
    FROM CardHolders ch
    JOIN Cards c ON ch.CardHolderID = c.CardHolderID
	WHERE CONCAT_WS(' ', FirstName, LastName, PrivateNumber, CardUID, Email, PhoneNumber) LIKE CONCAT('%', _query, '%');
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetCardHolders
DROP FUNCTION IF EXISTS `GetCardHolders`;
DELIMITER //
CREATE FUNCTION `GetCardHolders`() RETURNS longtext CHARSET utf8mb4 COLLATE utf8mb4_bin
BEGIN
	RETURN 1;
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetCELogCount
DROP FUNCTION IF EXISTS `GetCELogCount`;
DELIMITER //
CREATE FUNCTION `GetCELogCount`(`_query` VARCHAR(50)
) RETURNS int(11)
BEGIN
	RETURN (
		SELECT COUNT(DISTINCT CH.CardHolderID) AS logCount
		FROM ostiumconfigdb.cardholders CH
		LEFT JOIN ostiumconfigdb.cards C ON C.CardHolderID = CH.CardHolderID
		LEFT JOIN ostiumlogdb.logs CHL ON C.CardUID = CHL.CardUID
		WHERE CONCAT_WS(' ', CH.FirstName, ' ', CH.LastName, CH.IdentNumber, CH.PrivateNumber, CH.PhoneNumber, CH.Email) LIKE CONCAT('%', _query, '%')
	);
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetCurrentEvent
DROP FUNCTION IF EXISTS `GetCurrentEvent`;
DELIMITER //
CREATE FUNCTION `GetCurrentEvent`(`_query` VARCHAR(255),
	`_page` INT,
	`_itemsPerPage` INT
) RETURNS longtext CHARSET utf8mb4 COLLATE utf8mb4_bin
BEGIN
RETURN (
	WITH NR AS (
		SELECT DISTINCT CH.CardHolderID, CH.FirstName, CH.LastName, C.CardUID
		FROM ostiumconfigdb.cardholders CH
		LEFT JOIN ostiumconfigdb.cards C ON CH.CardHolderID = C.CardHolderID
		LEFT JOIN ostiumlogdb.logs CHL ON C.CardUID = CHL.CardUID
		WHERE CONCAT_WS(' ', CH.FirstName, CH.LastName, CH.IdentNumber, CH.PrivateNumber, CH.PhoneNumber, CH.Email) LIKE CONCAT('%', _query ,'%')
		ORDER BY CH.CardHolderID ASC
		OFFSET _page ROWS FETCH NEXT _itemsPerPage ROWS ONLY
	)
	SELECT
		JSON_ARRAYAGG(
			DISTINCT
			JSON_OBJECT(
				'CardHolderID', NR.CardHolderID,
				'FirstName', NR.FirstName,
				'LastName', NR.LastName,
				'connection_time', JSON_OBJECT(
					'startTime', getStartTime(NR.CardUID),
					'startTime_UNIX', (UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(getStartTime(NR.CardUID))) * 1000,
					'endTime', getEndTime(NR.CardUID),
					'timeBetween_UNIX', (UNIX_TIMESTAMP(getEndTime(NR.CardUID)) - UNIX_TIMESTAMP(getStartTime(NR.CardUID))) * 1000
				)
			)
		)
    FROM NR
);
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.getEndTime
DROP FUNCTION IF EXISTS `getEndTime`;
DELIMITER //
CREATE FUNCTION `getEndTime`(`_CardUID` VARCHAR(50)
) RETURNS datetime
BEGIN
	RETURN (
		WITH NXT AS (
			SELECT L.LogID, L.EventTime, L.Direction,
			LEAD(L.Direction, 1) OVER(PARTITION BY L.CardUID ORDER BY L.EventTime ASC) AS `next`
			FROM ostiumlogdb.`logs` L
			WHERE L.CardUID = _CardUID
		)
		SELECT N.EventTime FROM NXT N
		WHERE N.Direction = 0
		AND N.`next` IS NULL
	);
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetEndTime_r
DROP FUNCTION IF EXISTS `GetEndTime_r`;
DELIMITER //
CREATE FUNCTION `GetEndTime_r`(`_cuid` VARCHAR(255),
	`_et` DATETIME
) RETURNS time
BEGIN
	DECLARE mintime TIME;

	SELECT MAX(DATE_FORMAT(L.EventTime, '%H:%i:%s'))
	INTO mintime
	FROM ostiumlogdb.logs L
	WHERE DATE_FORMAT(L.EventTime, '%Y/%m/%d') = DATE_FORMAT(_et, '%Y/%m/%d')
	AND L.CardUID = _cuid
	AND L.Direction = 0;
	
	RETURN mintime;
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetHolderDefinedTimezones
DROP FUNCTION IF EXISTS `GetHolderDefinedTimezones`;
DELIMITER //
CREATE FUNCTION `GetHolderDefinedTimezones`(`_cid` INT
) RETURNS longtext CHARSET utf8mb4 COLLATE utf8mb4_bin
BEGIN
	DECLARE holder_timezones JSON;
	DECLARE is_checked BOOLEAN;
	
	WITH t_z AS (
		SELECT DISTINCT tz.Id AS timezoneId, ct.Id as cardTimezoneId,
        (SELECT isTimezoneChecked(_cid, tz.Id)) AS isLastChecked,
        (SELECT isTimezoneChecked(_cid, tz.Id)) AS isChecked,
        tz.startTime, tz.endTime, wd.Id AS weekdayId, wd.dayName, wd.dayNumber, tz.breakTime
        FROM timezone tz
        LEFT JOIN weekdays wd ON tz.weekDayId = wd.Id
        LEFT JOIN card_timezone ct ON ct.TimezoneID = tz.Id
        LEFT JOIN cards c ON ct.CardID = c.CardID
        GROUP BY tz.Id
        ORDER BY wd.dayNumber
	)
	SELECT JSON_ARRAYAGG(
		JSON_OBJECT(
			'timezoneId', timezoneId,
			'cardTimezoneId', cardTimezoneId,
			'isLastChecked', isLastChecked,
			'isChecked', isChecked,
			'startTime', startTime,
			'endTime', endTime,
			'weekdayId', weekDayId,
			'dayName', `dayName`,
			'dayNumber', dayNumber,
			'breakTime', breakTime
		)
	)
	INTO holder_timezones
	FROM t_z;
	
	
	RETURN holder_timezones;
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetIncomeTime_wp
DROP FUNCTION IF EXISTS `GetIncomeTime_wp`;
DELIMITER //
CREATE FUNCTION `GetIncomeTime_wp`(`_cuid` VARCHAR(50),
	`_st` TIME,
	`_et` DATETIME,
	`_asd` DATETIME,
	`_aed` DATETIME
) RETURNS longtext CHARSET utf8mb4 COLLATE utf8mb4_bin
BEGIN
	DECLARE wti JSON;
	
	WITH WorkTimeIncome AS (
        SELECT l.LogID, l.CardUID, DATE_FORMAT(l.EventTime, '%H:%i:%s') AS `Time`, l.EventTime AS `DateTime`, l.Direction,
		LEAD(l.Direction, 1) OVER(PARTITION BY l.CardUID ORDER BY `DateTime` ASC) as next,
		LEAD(l.EventTime, 1) OVER(PARTITION BY l.CardUID ORDER BY `DateTime` ASC) as nextTime
        FROM ostiumlogdb.logs l
	)
    SELECT JSON_OBJECT('contact', Time, 'timeDeviation', DATE_FORMAT(TIMEDIFF(_st, Time), '%H:%i:%s'))
    INTO wti
    FROM WorkTimeIncome _wti
    WHERE next = 0 AND _wti.Direction = 1 AND _wti.CardUID = _cuid AND DATE_FORMAT(_et, '%Y/%m/%d') = DATE_FORMAT(_wti.`DateTime`, '%Y/%m/%d') AND _wti.`DateTime` BETWEEN _asd AND IF(_aed IS NOT NULL, _aed, NOW())
    OR next IS NULL AND _wti.Direction = 1 AND _wti.CardUID = _cuid AND DATE_FORMAT(_et, '%Y/%m/%d') = DATE_FORMAT(_wti.`DateTime`, '%Y/%m/%d') AND _wti.`DateTime` BETWEEN _asd AND IF(_aed IS NOT NULL, _aed, NOW())
    OR DATE_FORMAT(nextTime, '%Y/%m/%d') > DATE_FORMAT(_wti.`DateTime`, '%Y/%m/%d') AND _wti.Direction = 1 AND _wti.CardUID = _cuid AND DATE_FORMAT(_et, '%Y/%m/%d') = DATE_FORMAT(_wti.`DateTime`, '%Y/%m/%d') AND _wti.`DateTime` BETWEEN _asd AND IF(_aed IS NOT NULL, _aed, NOW())
    ORDER BY _wti.`DateTime` ASC
	LIMIT 1;
	
	RETURN wti;
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetLogCount_r
DROP FUNCTION IF EXISTS `GetLogCount_r`;
DELIMITER //
CREATE FUNCTION `GetLogCount_r`(`_ids` VARCHAR(255),
	`_mindate` DATE,
	`_maxdate` DATE
) RETURNS int(11)
BEGIN
	DECLARE logCount INTEGER;

    SELECT COUNT(DISTINCT DATE_FORMAT(CHL.EventTime, '%Y/%m/%d'))
	INTO logCount
    FROM ostiumlogdb.logs CHL
    LEFT JOIN ostiumconfigdb.cards C ON CHL.CardUID = C.CardUID
    LEFT JOIN ostiumconfigdb.cardholders CH ON C.CardHolderID = CH.CardHolderID
    WHERE CH.CardHolderID IN (_ids)
	AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') >= _mindate
	AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') <= _maxdate;

	RETURN logCount;
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetLogCount_wp
DROP FUNCTION IF EXISTS `GetLogCount_wp`;
DELIMITER //
CREATE FUNCTION `GetLogCount_wp`(`_ids` VARCHAR(255),
	`_mindate` DATE,
	`_maxdate` DATE
) RETURNS int(11)
BEGIN
	DECLARE logCount INTEGER;
	
	SELECT COUNT(DISTINCT DATE_FORMAT(CHL.EventTime, '%Y/%m/%d'))
	INTO logCount
    FROM ostiumlogdb.logs CHL
    LEFT JOIN ostiumconfigdb.cards C ON CHL.CardUID = C.CardUID
    LEFT JOIN ostiumconfigdb.cardholders CH ON C.CardHolderID = CH.CardHolderID
    WHERE CH.CardHolderID IN (_ids)
    AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') >= _mindate AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') <= _maxdate;
    
    RETURN logCount;
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetOutcomeTime_wp
DROP FUNCTION IF EXISTS `GetOutcomeTime_wp`;
DELIMITER //
CREATE FUNCTION `GetOutcomeTime_wp`(`_cuid` VARCHAR(50),
	`_ed` TIME,
	`_et` DATETIME,
	`_asd` DATETIME,
	`_aed` DATETIME
) RETURNS longtext CHARSET utf8mb4 COLLATE utf8mb4_bin
BEGIN
	DECLARE wto JSON;

	WITH WorkTimeOutcome AS (
        SELECT l.LogID, l.CardUID, DATE_FORMAT(l.EventTime, '%H:%i:%s') AS TIME, l.EventTime AS `DateTime`, l.Direction,
		LEAD(l.Direction, 1) OVER(PARTITION BY l.CardUID ORDER BY l.EventTime DESC) as next
        FROM ostiumlogdb.logs l
    )
    SELECT JSON_OBJECT('contact', Time, 'timeDeviation', DATE_FORMAT(TIMEDIFF(Time, _ed), '%H:%i:%s'))
    INTO wto
    FROM WorkTimeOutcome _wto
    WHERE next IS NOT NULL AND _wto.Direction = 0 AND _wto.CardUID = _cuid AND DATE_FORMAT(_et, '%Y/%m/%d') = DATE_FORMAT(_wto.`DateTime`, '%Y/%m/%d') AND _wto.`DateTime` BETWEEN _asd AND IF(_aed IS NOT NULL, _aed, NOW())
    OR next IS NULL AND _wto.Direction = 0 AND _wto.CardUID = _cuid AND DATE_FORMAT(_et, '%Y/%m/%d') = DATE_FORMAT(_wto.`DateTime`, '%Y/%m/%d') AND _wto.`DateTime` BETWEEN _asd AND IF(_aed IS NOT NULL, _aed, NOW())
    ORDER BY _wto.`DateTime` DESC
	LIMIT 1;
	
	RETURN wto;
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetReports
DROP FUNCTION IF EXISTS `GetReports`;
DELIMITER //
CREATE FUNCTION `GetReports`(`_ids` VARCHAR(255),
	`_mindate` DATE,
	`_maxdate` DATE,
	`_page` INT,
	`_itemsperpage` INT
) RETURNS longtext CHARSET utf8mb4 COLLATE utf8mb4_bin
BEGIN
	/* DECLARE reports JSON;

	WITH r AS (
		SELECT CH.FirstName, CH.LastName, CHL.CardUID,
		DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') AS IncomeDay,
		(SELECT GetStartTime_r(C.CardUID, CHL.EventTime)) AS StartTime,
		(SELECT GetEndTime_r(C.CardUID, CHL.EventTime)) AS EndTime,
		TIME_FORMAT(
			TIMEDIFF(
			    IF((SELECT GetEndTime_r(C.CardUID, CHL.EventTime)),
			    	(SELECT GetEndTime_r(C.CardUID, CHL.EventTime)),
					DATE_FORMAT(NOW(), '%H:%i:%s')
				),
			    (SELECT GetStartTime_r(C.CardUID, CHL.EventTime))
			),
			'%H:%i:%s'
		) AS Duration
		FROM ostiumlogdb.logs CHL
		JOIN ostiumconfigdb.cards C ON CHL.CardUID = C.CardUID
		JOIN ostiumconfigdb.cardholders CH ON C.CardHolderID = CH.CardHolderID
		WHERE CH.CardHolderID IN (_ids)
		AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') >= _mindate AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') <= _maxdate
		AND (SELECT GetEndTime_r(C.CardUID, CHL.EventTime)) IS NOT NULL
		AND (SELECT GetStartTime_r(C.CardUID, CHL.EventTime)) IS NOT NULL
		GROUP BY DATE_FORMAT(CHL.EventTime, '%Y/%m/%d'), CH.CardHolderID
		ORDER BY CHL.EventTime ASC
		OFFSET _page ROWS FETCH NEXT _itemsperpage ROWS ONLY
	)
	SELECT JSON_ARRAYAGG(
		JSON_OBJECT(
			'FirstName', r.FirstName,
			'LastName', r.LastName,
			'CardUID', r.CardUID,
			'IncomeDay', r.IncomeDay,
			'StartTime', r.StartTime,
			'EndTime', r.EndTime,
			'Duration', r.Duration
		)
	)
	INTO reports
	FROM r;

	RETURN reports; */
	
		RETURN (SELECT CH.FirstName, CH.LastName, CHL.CardUID,
		DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') AS IncomeDay,
		(SELECT GetStartTime_r(C.CardUID, CHL.EventTime)) AS StartTime,
		(SELECT GetEndTime_r(C.CardUID, CHL.EventTime)) AS EndTime,
		TIME_FORMAT(
			TIMEDIFF(
			    IF((SELECT GetEndTime_r(C.CardUID, CHL.EventTime)),
			    	(SELECT GetEndTime_r(C.CardUID, CHL.EventTime)),
					DATE_FORMAT(NOW(), '%H:%i:%s')
				),
			    (SELECT GetStartTime_r(C.CardUID, CHL.EventTime))
			),
			'%H:%i:%s'
		) AS Duration
		FROM ostiumlogdb.logs CHL
		JOIN ostiumconfigdb.cards C ON CHL.CardUID = C.CardUID
		JOIN ostiumconfigdb.cardholders CH ON C.CardHolderID = CH.CardHolderID
		WHERE CH.CardHolderID IN (_ids)
		AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') >= _mindate AND DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') <= _maxdate
		AND (SELECT GetEndTime_r(C.CardUID, CHL.EventTime)) IS NOT NULL
		AND (SELECT GetStartTime_r(C.CardUID, CHL.EventTime)) IS NOT NULL
		GROUP BY DATE_FORMAT(CHL.EventTime, '%Y/%m/%d'), CH.CardHolderID
		ORDER BY CHL.EventTime ASC
		OFFSET _page ROWS FETCH NEXT _itemsperpage ROWS ONLY);
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.getStartTime
DROP FUNCTION IF EXISTS `getStartTime`;
DELIMITER //
CREATE FUNCTION `getStartTime`(`_CardUID` VARCHAR(50)
) RETURNS datetime
BEGIN
	RETURN (
		SELECT MIN(L.EventTime)
		FROM ostiumlogdb.`logs` L
		WHERE L.CardUID = _CardUID
		AND DATE_FORMAT(NOW(), '%Y/%m/%d') = DATE_FORMAT(L.EventTime, '%Y/%m/%d')
		AND L.Direction = 1
	);
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetStartTime_r
DROP FUNCTION IF EXISTS `GetStartTime_r`;
DELIMITER //
CREATE FUNCTION `GetStartTime_r`(`_cuid` VARCHAR(50),
	`_et` DATETIME
) RETURNS time
BEGIN
	DECLARE mintime TIME;

	SELECT MIN(DATE_FORMAT(L.EventTime, '%H:%i:%s'))
	INTO mintime
	FROM ostiumlogdb.logs L
	WHERE DATE_FORMAT(L.EventTime, '%Y/%m/%d') = DATE_FORMAT(_et, '%Y/%m/%d')
	AND L.CardUID = _cuid
	AND L.Direction = 1;
	
	RETURN mintime;
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetTimezone
DROP FUNCTION IF EXISTS `GetTimezone`;
DELIMITER //
CREATE FUNCTION `GetTimezone`(`_cardId` INT
) RETURNS longtext CHARSET utf8mb4 COLLATE utf8mb4_bin
BEGIN
DECLARE res JSON;
SELECT
				JSON_OBJECT(
					'Id', tzg.Id,
					'groupId', tzg.groupName,
					'timezone_plan', JSON_ARRAYAGG(
						JSON_OBJECT(
							'Id', tzp.Id,
							'startTime', tzp.startTime,
							'endTime', tzp.endTime,
							'breakAnytime', IF(tzp.breakAnytime = 1, 1, 0),
							'breakTimes', tzp.breakTimes,
							'weekDays', (
								SELECT JSON_ARRAYAGG(
									JSON_OBJECT(
										'Id', wd.Id,
										'dayName', wd.dayName,
										'dayNumber', wd.dayNumber
									)
								)
								FROM weekdays_timezone_plan wdtzp
								JOIN weekdays wd ON wdtzp.weekday_id = wd.Id
								WHERE wdtzp.timezone_plan_id = tzp.Id
							)
						)
					)
				)
				INTO res
				FROM timezone_group tzg
				JOIN timezone_plan tzp ON tzg.Id = tzp.timezone_group_id
				JOIN card_timezone ctz ON tzg.Id = ctz.TimezoneID
				WHERE ctz.CardID = _cardId
				AND ctz.AccessEndDate IS NULL;
				RETURN res;
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetTotalWorkTimeIncome_wp
DROP FUNCTION IF EXISTS `GetTotalWorkTimeIncome_wp`;
DELIMITER //
CREATE FUNCTION `GetTotalWorkTimeIncome_wp`(`_cuid` VARCHAR(50),
	`_et` DATETIME,
	`_asd` DATETIME,
	`_aed` DATETIME
) RETURNS datetime
BEGIN
	DECLARE wto DATETIME;

	WITH WorkTimeOutcome AS (
		SELECT LogID, CardUID, EventTime AS Time, EventTime AS DateTime, Direction,
		LEAD(Direction, 1) OVER(PARTITION BY CardUID ORDER BY EventTime DESC) as next
		FROM ostiumlogdb.logs
	)
	SELECT Time
	INTO wto
	FROM WorkTimeOutcome
	WHERE next IS NOT NULL AND Direction = 0 AND CardUID = _cuid AND DATE_FORMAT(_et, '%Y/%m/%d') = DATE_FORMAT(DateTime, '%Y/%m/%d') AND DateTime BETWEEN _asd AND IF(_aed IS NOT NULL, _aed, NOW())
	OR next IS NULL AND Direction = 0 AND CardUID = _cuid AND DATE_FORMAT(_et, '%Y/%m/%d') = DATE_FORMAT(DateTime, '%Y/%m/%d') AND DateTime BETWEEN _asd AND IF(_aed IS NOT NULL, _aed, NOW())
	ORDER BY DateTime DESC
	LIMIT 1;
	
	RETURN wto;
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.GetTotalWorkTimeOutcome_wp
DROP FUNCTION IF EXISTS `GetTotalWorkTimeOutcome_wp`;
DELIMITER //
CREATE FUNCTION `GetTotalWorkTimeOutcome_wp`(`_cuid` VARCHAR(50),
	`_et` DATETIME,
	`_asd` DATETIME,
	`_aed` DATETIME
) RETURNS datetime
BEGIN
	DECLARE wti DATETIME;

	WITH WorkTimeIncome AS (
		SELECT LogID, CardUID, EventTime AS Time, EventTime AS DateTime, Direction,
		LEAD(Direction, 1) OVER(PARTITION BY CardUID ORDER BY DateTime ASC) as next,
		LEAD(EventTime, 1) OVER(PARTITION BY CardUID ORDER BY DateTime ASC) as nextTime
		FROM ostiumlogdb.logs
	)
	SELECT Time
	INTO wti
	FROM WorkTimeIncome
	WHERE next = 0 AND Direction = 1 AND CardUID = _cuid AND DATE_FORMAT(_et, '%Y/%m/%d') = DATE_FORMAT(DateTime, '%Y/%m/%d') AND DateTime BETWEEN _asd AND IF(_aed IS NOT NULL, _aed, NOW())
	OR next IS NULL AND Direction = 1 AND CardUID = _cuid AND DATE_FORMAT(_et, '%Y/%m/%d') = DATE_FORMAT(DateTime, '%Y/%m/%d') AND DateTime BETWEEN _asd AND IF(_aed IS NOT NULL, _aed, NOW())
	OR nextTime > DateTime AND Direction = 1 AND CardUID = _cuid AND DATE_FORMAT(_et, '%Y/%m/%d') = DATE_FORMAT(DateTime, '%Y/%m/%d') AND DateTime BETWEEN _asd AND IF(_aed IS NOT NULL, _aed, NOW())
	ORDER BY DateTime ASC
	LIMIT 1;
	
	RETURN wti;
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.isTimezoneChecked
DROP FUNCTION IF EXISTS `isTimezoneChecked`;
DELIMITER //
CREATE FUNCTION `isTimezoneChecked`(`_cid` INT,
	`_tid` INT
) RETURNS int(11)
BEGIN
	DECLARE isChecked BOOLEAN;
	
	SET isChecked = (SELECT EXISTS(SELECT ct2.Id FROM card_timezone ct2 WHERE ct2.CardID = _cid AND ct2.TimezoneID = _tid AND ct2.AccessStartDate IS NOT NULL AND ct2.AccessEndDate IS NULL));
	
	RETURN IF(isChecked, 1, 0);
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.RegisterCardHolder
DROP FUNCTION IF EXISTS `RegisterCardHolder`;
DELIMITER //
CREATE FUNCTION `RegisterCardHolder`(`_pn` VARCHAR(50),
	`_fn` VARCHAR(50),
	`_ln` VARCHAR(50),
	`_in` VARCHAR(50),
	`_bd` DATE,
	`_g` BIT,
	`_phn` VARCHAR(50),
	`_e` VARCHAR(100),
	`_p` VARCHAR(500),
	`_cuid` VARCHAR(50),
	`_dd` DATETIME,
	`_as` BIT
) RETURNS longtext CHARSET utf8mb4 COLLATE utf8mb4_bin
BEGIN
	DECLARE pn_count INT;
	DECLARE message JSON;
	
	SELECT COUNT(PrivateNumber) INTO pn_count FROM cardholders WHERE PrivateNumber = _pn;
	
	IF (CHAR_LENGTH(_fn) = 0 OR CHAR_LENGTH(_ln) = 0 OR CHAR_LENGTH(_pn) = 0) THEN
		SET message = JSON_OBJECT(
			'message', 'შეავსეთ ყველა სავალდებულო ველი(*)',
			'status', 'error'	
		);
	ELSEIF (pn_count > 0) THEN
		SET message = JSON_OBJECT(
			'message', 'მითითებული პირადი ნომრით ბარათის მფლობელი არსებობს',
			'status', 'error'
		);
	ELSE
		INSERT INTO cardholders
			(FirstName, LastName, IdentNumber, PrivateNumber, BirthDate, Gender, PhoneNumber, Email, Photo, RegistrationDate)
		VALUES(_fn, _ln, _in, _pn, _bd, _g, _phn, _e, _p, NOW());
			
		INSERT INTO cards
		(CardUID, ActivationDate, DeactivationDate, ActivationStatus, CardHolderID)
		VALUES(_cuid, NOW(), _dd, _as, LAST_INSERT_ID());
			
		SET message = JSON_OBJECT(
			'message', 'მფლობელი წარმატებით დაემატა',
			'status', 'success',
			'card_id', LAST_INSERT_ID()
		);
	END IF;
	
	RETURN message;
END//
DELIMITER ;

-- Dumping structure for function ostiumconfigdb.UpdateHolderTimezones
DROP FUNCTION IF EXISTS `UpdateHolderTimezones`;
DELIMITER //
CREATE FUNCTION `UpdateHolderTimezones`(`_cid` INT,
	`_tid` INT
) RETURNS longtext CHARSET utf8mb4 COLLATE utf8mb4_bin
BEGIN
	DECLARE CTIsTheSame BOOLEAN;
	DECLARE jsonResult JSON;
	
	SET CTIsTheSame = (SELECT EXISTS(SELECT ctz.Id FROM card_timezone ctz WHERE ctz.CardID = _cid AND ctz.TimezoneID = _tid AND ctz.AccessEndDate IS NULL));
	
	IF (NOT CTIsTheSame) THEN
		UPDATE card_timezone SET AccessEndDate = NOW()
		WHERE CardID = _cid AND AccessEndDate IS NULL;
		
		INSERT INTO card_timezone (CardID, TimezoneId, AccessStartDate, AccessEndDate)
		VALUES (_cid, _tid, NOW(), NULL);
	END IF;
	
	SELECT JSON_NORMALIZE(GetTimezone(_cid))
	INTO jsonResult;

	RETURN jsonResult;
END//
DELIMITER ;

-- Dumping structure for view ostiumconfigdb.get_card_holders
DROP VIEW IF EXISTS `get_card_holders`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `get_card_holders`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `get_card_holders` AS SELECT 
    ch.CardHolderID, 
    ch.FirstName, 
    ch.LastName, 
    ch.PrivateNumber, 
    ch.IdentNumber, 
    ch.PhoneNumber, 
    ch.Email, 
    ch.BirthDate,
    IF(ch.Gender, 'true', 'false') AS Gender, 
    ch.Photo, 
    c.CardID, 
    c.CardUID, 
    c.DeactivationDate, 
    CAST(c.ActivationStatus AS INT) AS ActivationStatus,

    -- Precompute JSON structure for working days and timezone plan
    (
        SELECT JSON_OBJECT(
            'Id', tzg.Id,
            'groupId', tzg.groupName,
            'timezone_plan', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'Id', tzp.Id,
                    'startTime', tzp.startTime,
                    'endTime', tzp.endTime,
                    'breakAnytime', IF(tzp.breakAnytime = 1, 1, 0),
                    'breakTimes', tzp.breakTimes,
                    'weekDays', (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'Id', wd.Id,
                                'dayName', wd.dayName,
                                'dayNumber', wd.dayNumber
                            )
                        )
                        FROM weekdays_timezone_plan wdtzp
                        JOIN weekdays wd ON wdtzp.weekday_id = wd.Id
                        WHERE wdtzp.timezone_plan_id = tzp.Id
                    )
                )
            )
        )
        FROM timezone_group tzg
        JOIN timezone_plan tzp ON tzg.Id = tzp.timezone_group_id
        JOIN card_timezone ctz ON tzg.Id = ctz.TimezoneID
        WHERE ctz.CardID = c.CardID
        AND ctz.AccessEndDate IS NULL
    ) AS WorkingDays

FROM cardholders ch
JOIN cards c ON ch.CardHolderID = c.CardHolderID

-- Avoid unnecessary joins
LEFT JOIN card_timezone ctz ON c.CardID = ctz.CardID AND ctz.AccessEndDate IS NULL
LEFT JOIN timezone_group tzg ON tzg.Id = ctz.TimezoneID
LEFT JOIN timezone_plan tzp ON tzg.Id = tzp.timezone_group_id

-- Group by relevant columns to ensure multiple rows are returned
GROUP BY 
    ch.CardHolderID, 
    ch.FirstName, 
    ch.LastName, 
    ch.PrivateNumber, 
    ch.IdentNumber, 
    ch.PhoneNumber, 
    ch.Email, 
    ch.BirthDate, 
    ch.Gender, 
    ch.Photo, 
    c.CardID, 
    c.CardUID, 
    c.DeactivationDate, 
    c.ActivationStatus

LIMIT 100 ;

-- Dumping structure for view ostiumconfigdb.get_nonoutcomed_cards
DROP VIEW IF EXISTS `get_nonoutcomed_cards`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `get_nonoutcomed_cards`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `get_nonoutcomed_cards` AS SELECT DISTINCT CH.FirstName, CH.LastName, CHL.CardUID, DATE_FORMAT(CHL.EventTime, '%Y/%m/%d') AS IncomeDay,
	(
		SELECT
			MIN(DATE_FORMAT(L.EventTime, '%H:%i:%s'))
		FROM ostiumlogdb.logs L
		WHERE DATE_FORMAT(L.EventTime, '%Y/%m/%d') = DATE_FORMAT(CHL.EventTime, '%Y/%m/%d')
		AND L.CardUID = C.CardUID
		AND L.Direction = 1
	) AS StartTime,
    (
		SELECT
			MAX(DATE_FORMAT(L.EventTime, '%H:%i:%s'))
		FROM ostiumlogdb.logs L
		WHERE DATE_FORMAT(L.EventTime, '%Y/%m/%d') = DATE_FORMAT(CHL.EventTime, '%Y/%m/%d')
		AND L.CardUID = C.CardUID
		AND L.Direction = 0
	) AS EndTime,

    TIMEDIFF(
        IF(
			(
				SELECT 
					MAX(L.EventTime)
				FROM ostiumlogdb.logs L
				WHERE DATE_FORMAT(L.EventTime, '%Y/%m/%d') = DATE_FORMAT(CHL.EventTime, '%Y/%m/%d')
				AND L.CardUID = C.CardUID
				AND L.Direction = 0
			) IS NOT NULL,
        	(
				SELECT 
					MAX(L.EventTime)
				FROM ostiumlogdb.logs L
				WHERE DATE_FORMAT(L.EventTime, '%Y/%m/%d') = DATE_FORMAT(CHL.EventTime, '%Y/%m/%d')
				AND L.CardUID = C.CardUID
				AND L.Direction = 0
			), 
			NOW()
		),
        (
			SELECT 
				MIN(L.EventTime)
			FROM ostiumlogdb.logs L
			WHERE DATE_FORMAT(L.EventTime, '%Y/%m/%d') = DATE_FORMAT(CHL.EventTime, '%Y/%m/%d')
			AND L.CardUID = C.CardUID
			AND L.Direction = 1
		)
    ) AS Duration
                
FROM ostiumlogdb.logs CHL
LEFT JOIN ostiumconfigdb.cards C ON CHL.CardUID = C.CardUID
LEFT JOIN ostiumconfigdb.cardholders CH ON C.CardHolderID = CH.CardHolderID

WHERE (
	SELECT
		MIN(DATE_FORMAT(L.EventTime, '%H:%i:%s'))
	FROM ostiumlogdb.logs L
	WHERE DATE_FORMAT(L.EventTime, '%Y/%m/%d') = DATE_FORMAT(CHL.EventTime, '%Y/%m/%d')
	AND L.CardUID = C.CardUID
	AND L.Direction = 1
) IS NOT NULL

AND (
	SELECT
		MAX(DATE_FORMAT(L.EventTime, '%H:%i:%s'))
	FROM ostiumlogdb.logs L
	WHERE DATE_FORMAT(L.EventTime, '%Y/%m/%d') = DATE_FORMAT(CHL.EventTime, '%Y/%m/%d')
	AND L.CardUID = C.CardUID
	AND L.Direction = 0
) IS NULL ;

-- Dumping structure for view ostiumconfigdb.get_timezones
DROP VIEW IF EXISTS `get_timezones`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `get_timezones`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `get_timezones` AS SELECT DISTINCT
	tzg.Id, tzg.groupName,
	JSON_ARRAYAGG(
		JSON_OBJECT(
			'Id', tzp.Id,
			'startTime', tzp.startTime,
			'endTime', tzp.endTime,
			'breakAnytime', IF(tzp.breakAnytime = 1, 1, 0),
			'breakTimes', tzp.breakTimes,
			'weekDays', (
				SELECT JSON_ARRAYAGG(
					JSON_OBJECT(
						'Id', wd.Id,
						'dayName', wd.dayName,
						'dayNumber', wd.dayNumber
					)
				)
				FROM weekdays_timezone_plan wdtzp
				JOIN weekdays wd ON wdtzp.weekday_id = wd.Id
				WHERE wdtzp.timezone_plan_id = tzp.Id
			)
		)
	) AS timezone_plan
FROM timezone_group tzg
JOIN timezone_plan tzp ON tzg.Id = tzp.timezone_group_id
GROUP BY tzg.Id ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
