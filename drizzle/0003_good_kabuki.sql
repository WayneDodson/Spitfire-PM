CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(64) NOT NULL,
	`xpReward` int NOT NULL DEFAULT 0,
	`category` enum('milestone','streak','mastery','social','special') NOT NULL,
	`orderIndex` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`),
	CONSTRAINT `achievements_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `userAchievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementId` int NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userAchievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalXp` int NOT NULL DEFAULT 0,
	`level` int NOT NULL DEFAULT 1,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastLoginDate` timestamp,
	`lessonsCompleted` int NOT NULL DEFAULT 0,
	`quizzesCompleted` int NOT NULL DEFAULT 0,
	`perfectScores` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userStats_id` PRIMARY KEY(`id`),
	CONSTRAINT `userStats_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `xpTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`reason` varchar(255) NOT NULL,
	`entityType` enum('lesson','quiz','achievement','streak','bonus','other'),
	`entityId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `xpTransactions_id` PRIMARY KEY(`id`)
);
