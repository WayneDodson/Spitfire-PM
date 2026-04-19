CREATE TABLE `emailTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tokenHash` varchar(64) NOT NULL,
	`type` enum('email_verification','password_reset') NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`used` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailTokens_tokenHash_unique` UNIQUE(`tokenHash`)
);
