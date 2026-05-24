CREATE TABLE `apmModuleProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` varchar(32) NOT NULL,
	`qualificationId` varchar(32) NOT NULL,
	`bestScore` int NOT NULL DEFAULT 0,
	`totalQuestions` int NOT NULL,
	`passed` boolean NOT NULL DEFAULT false,
	`attempts` int NOT NULL DEFAULT 0,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`passedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `apmModuleProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `apmModules` (
	`id` varchar(32) NOT NULL,
	`qualificationId` varchar(32) NOT NULL,
	`moduleNumber` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`duration` varchar(32),
	`intro` text,
	`sections` text NOT NULL,
	`terms` text,
	`quiz` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `apmModules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `apmQualifications` (
	`id` varchar(32) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(255),
	`level` varchar(64) NOT NULL,
	`description` text,
	`estimatedHours` int NOT NULL,
	`orderIndex` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `apmQualifications_id` PRIMARY KEY(`id`)
);
