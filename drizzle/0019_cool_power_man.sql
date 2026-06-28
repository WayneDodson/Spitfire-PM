ALTER TABLE `coachingServices` ADD `normalPricePence` int;--> statement-breakpoint
ALTER TABLE `coachingServices` ADD `foundingLabel` varchar(128);--> statement-breakpoint
ALTER TABLE `coachingServices` ADD `savingsText` varchar(255);--> statement-breakpoint
ALTER TABLE `coachingServices` ADD `bestFor` varchar(255);--> statement-breakpoint
ALTER TABLE `coachingServices` ADD `isFoundingPriceActive` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `coachingServices` ADD `foundingPlacesTotal` int;--> statement-breakpoint
ALTER TABLE `coachingServices` ADD `foundingPlacesRemaining` int;--> statement-breakpoint
ALTER TABLE `coachingServices` ADD `featureNote` varchar(512);