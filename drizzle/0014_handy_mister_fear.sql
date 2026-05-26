CREATE TABLE `brainSnapQuestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` text NOT NULL,
	`options` text NOT NULL,
	`correctOptionId` varchar(4) NOT NULL,
	`explanation` text NOT NULL,
	`topicTag` varchar(64),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `brainSnapQuestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userBrainSnapLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`questionId` int NOT NULL,
	`answeredCorrectly` boolean,
	`seenAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userBrainSnapLog_id` PRIMARY KEY(`id`)
);
