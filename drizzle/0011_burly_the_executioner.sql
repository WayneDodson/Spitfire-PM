ALTER TABLE `lessons` MODIFY COLUMN `estimatedMinutes` int NOT NULL DEFAULT 10;--> statement-breakpoint
ALTER TABLE `knowledgeChecks` ADD `lessonId` int;--> statement-breakpoint
ALTER TABLE `knowledgeChecks` ADD `reinforcementMessage` varchar(255);--> statement-breakpoint
ALTER TABLE `knowledgeChecks` ADD `isLevelAssessment` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `lessons` ADD `parentLessonId` int;--> statement-breakpoint
ALTER TABLE `lessons` ADD `partNumber` int;--> statement-breakpoint
ALTER TABLE `userLessonProgress` ADD `confidenceCheckPassed` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `userLessonProgress` ADD `confidenceCheckPassedAt` timestamp;--> statement-breakpoint
ALTER TABLE `userLessonProgress` ADD `reflectionResponse` enum('yes','almost','need_more_practice');