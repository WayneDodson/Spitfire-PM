CREATE TABLE `knowledgeChecks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`levelId` int NOT NULL,
	`afterLessonNumber` int NOT NULL,
	`question` text NOT NULL,
	`options` text NOT NULL,
	`correctAnswerIndex` int NOT NULL,
	`explanation` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `knowledgeChecks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`levelId` int NOT NULL,
	`lessonNumber` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`estimatedMinutes` int NOT NULL DEFAULT 30,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userKnowledgeCheckAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`knowledgeCheckId` int NOT NULL,
	`selectedAnswerIndex` int NOT NULL,
	`correct` boolean NOT NULL,
	`attemptedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userKnowledgeCheckAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userLessonProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userLessonProgress_id` PRIMARY KEY(`id`)
);
