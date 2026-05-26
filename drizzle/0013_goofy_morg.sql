CREATE TABLE `simulations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`levelId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`type` enum('decision_sim','interview_sim','build_sim','full_project') NOT NULL,
	`difficulty` enum('beginner','intermediate','advanced') NOT NULL,
	`categoryTag` enum('high_impact','interview_favourite','common_scenario','confidence_builder','exam_prep') NOT NULL,
	`estimatedMinutes` int NOT NULL,
	`accessType` enum('free','pro') NOT NULL DEFAULT 'pro',
	`content` text NOT NULL,
	`orderIndex` int NOT NULL,
	`isInterviewBank` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `simulations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userSimulationProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`simulationId` int NOT NULL,
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`bestScore` int,
	`latestScore` int,
	`attempts` int NOT NULL DEFAULT 0,
	`savedState` text,
	`lastFeedback` text,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userSimulationProgress_id` PRIMARY KEY(`id`)
);
