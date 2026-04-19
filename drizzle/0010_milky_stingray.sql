CREATE TABLE `cancellationReasons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reason` enum('too_expensive','need_more_time','not_using_enough','feel_overwhelmed','unsure_if_ready','got_the_job','struggling_with_interviews','need_career_advice','other') NOT NULL,
	`customReason` text,
	`readinessScore` int,
	`levelsCompleted` int,
	`overallProgress` decimal(5,2),
	`careerGoal` varchar(255),
	`currentIndustry` varchar(100),
	`targetRole` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cancellationReasons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mentorRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cancellationReasonId` int,
	`helpTopics` text,
	`mainQuestion` text NOT NULL,
	`currentSituation` text,
	`desiredOutcome` text,
	`status` enum('pending','scheduled','completed','no_show') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mentorRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reEngagementOptIns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cancellationReasonId` int,
	`optedIn` boolean NOT NULL DEFAULT false,
	`checkInDate` timestamp,
	`checkInSent` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reEngagementOptIns_id` PRIMARY KEY(`id`)
);
