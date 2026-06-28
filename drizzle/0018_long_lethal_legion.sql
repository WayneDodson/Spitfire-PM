CREATE TABLE `coachingAvailability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dayOfWeek` int NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`sessionDurationMinutes` int NOT NULL DEFAULT 60,
	`bufferMinutes` int NOT NULL DEFAULT 15,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coachingAvailability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coachingBlockedDates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`reason` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coachingBlockedDates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coachingBookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`serviceId` int NOT NULL,
	`status` enum('pending_review','accepted','declined','payment_pending','confirmed','scheduled','completed','no_show','cancelled','rescheduled') NOT NULL DEFAULT 'pending_review',
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32),
	`jobTitle` varchar(255) NOT NULL,
	`industry` varchar(128) NOT NULL,
	`country` varchar(128) NOT NULL,
	`timezone` varchar(64) NOT NULL,
	`qualifications` text,
	`targetRole` varchar(255) NOT NULL,
	`mainChallenge` text NOT NULL,
	`timeline` varchar(32) NOT NULL,
	`interestedInPaid` boolean NOT NULL DEFAULT false,
	`preferredDays` varchar(128),
	`preferredTimes` varchar(128),
	`privacyConsent` boolean NOT NULL DEFAULT false,
	`bookingConsent` boolean NOT NULL DEFAULT false,
	`scheduledAt` timestamp,
	`meetingLink` varchar(512),
	`stripeSessionId` varchar(255),
	`stripePaymentIntentId` varchar(255),
	`amountPaidPence` int,
	`paidAt` timestamp,
	`refundIssued` boolean NOT NULL DEFAULT false,
	`refundNotes` text,
	`adminNotes` text,
	`freeAssessmentEligibleAgain` boolean NOT NULL DEFAULT false,
	`reminder24hSentAt` timestamp,
	`reminder1hSentAt` timestamp,
	`followUpSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coachingBookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coachingServices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('free','paid','application') NOT NULL,
	`pricePence` int NOT NULL DEFAULT 0,
	`durationMinutes` int NOT NULL,
	`shortDescription` text NOT NULL,
	`features` text NOT NULL,
	`stripePriceId` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`orderIndex` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coachingServices_id` PRIMARY KEY(`id`),
	CONSTRAINT `coachingServices_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `coachingTestimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorName` varchar(255) NOT NULL,
	`authorTitle` varchar(255),
	`content` text NOT NULL,
	`isVisible` boolean NOT NULL DEFAULT false,
	`orderIndex` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coachingTestimonials_id` PRIMARY KEY(`id`)
);
