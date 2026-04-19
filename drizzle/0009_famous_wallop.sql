CREATE TABLE `dailyEngagement` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`loggedIn` boolean NOT NULL DEFAULT true,
	`lessonsCompleted` int NOT NULL DEFAULT 0,
	`simulationsCompleted` int NOT NULL DEFAULT 0,
	`checksCompleted` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyEngagement_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `trialStartedAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `trialEndsAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `founderAccessEarned` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `founderAccessEarnedAt` timestamp;