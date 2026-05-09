/*
  Warnings:

  - You are about to drop the column `amenities` on the `hotel` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `hotel` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `hotel` table. All the data in the column will be lost.
  - You are about to drop the column `reviews` on the `hotel` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `hotel` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `acompte` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `visiteurId` on the `reservation` table. All the data in the column will be lost.
  - The values [HOTEL] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `abonnement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categoriechambre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chambre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visiteur` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Hotel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `country` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelType` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `abonnement` DROP FOREIGN KEY `Abonnement_hotelId_fkey`;

-- DropForeignKey
ALTER TABLE `categoriechambre` DROP FOREIGN KEY `CategorieChambre_hotelId_fkey`;

-- DropForeignKey
ALTER TABLE `chambre` DROP FOREIGN KEY `Chambre_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `chambre` DROP FOREIGN KEY `Chambre_hotelId_fkey`;

-- DropForeignKey
ALTER TABLE `client` DROP FOREIGN KEY `Client_userId_fkey`;

-- DropForeignKey
ALTER TABLE `hotel` DROP FOREIGN KEY `Hotel_userId_fkey`;

-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_visiteurId_fkey`;

-- DropIndex
DROP INDEX `Hotel_userId_key` ON `hotel`;

-- DropIndex
DROP INDEX `Reservation_clientId_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Reservation_roomId_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Reservation_visiteurId_fkey` ON `reservation`;

-- AlterTable
ALTER TABLE `hotel` DROP COLUMN `amenities`,
    DROP COLUMN `images`,
    DROP COLUMN `rating`,
    DROP COLUMN `reviews`,
    DROP COLUMN `userId`,
    ADD COLUMN `averageRating` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `cancellationPolicy` TEXT NULL,
    ADD COLUMN `checkInTime` VARCHAR(191) NULL,
    ADD COLUMN `checkOutTime` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `coverImage` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `hotelType` ENUM('HOTEL', 'MOTEL', 'RESORT', 'APARTMENT', 'VILLA', 'HOSTEL', 'LODGE', 'GUEST_HOUSE') NOT NULL,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `logo` VARCHAR(191) NULL,
    ADD COLUMN `longitude` DOUBLE NULL,
    ADD COLUMN `ownerId` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `reviewCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `shortDescription` VARCHAR(191) NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `website` VARCHAR(191) NULL,
    ADD COLUMN `whatsapp` VARCHAR(191) NULL,
    MODIFY `address` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `isActive`,
    DROP COLUMN `method`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `paymentMethod` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `acompte`,
    DROP COLUMN `clientId`,
    DROP COLUMN `isActive`,
    DROP COLUMN `visiteurId`,
    ADD COLUMN `paidAmount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    MODIFY `role` ENUM('ADMIN', 'HOTEL_OWNER', 'CLIENT') NOT NULL DEFAULT 'CLIENT';

-- DropTable
DROP TABLE `abonnement`;

-- DropTable
DROP TABLE `categoriechambre`;

-- DropTable
DROP TABLE `chambre`;

-- DropTable
DROP TABLE `client`;

-- DropTable
DROP TABLE `visiteur`;

-- CreateTable
CREATE TABLE `HotelImage` (
    `id` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hotelId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HotelAmenity` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hotelId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` VARCHAR(191) NOT NULL,
    `roomNumber` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `price` DOUBLE NOT NULL,
    `capacity` INTEGER NOT NULL,
    `bedCount` INTEGER NULL,
    `bathroomCount` INTEGER NULL,
    `size` DOUBLE NULL,
    `status` ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomImage` (
    `id` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomAmenity` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(191) NOT NULL,
    `planName` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hotelId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubscriptionTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subscriptionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SubscriptionTransaction_transactionId_key`(`transactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Hotel_slug_key` ON `Hotel`(`slug`);

-- AddForeignKey
ALTER TABLE `Hotel` ADD CONSTRAINT `Hotel_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HotelImage` ADD CONSTRAINT `HotelImage_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HotelAmenity` ADD CONSTRAINT `HotelAmenity_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomCategory` ADD CONSTRAINT `RoomCategory_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `RoomCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomImage` ADD CONSTRAINT `RoomImage_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomAmenity` ADD CONSTRAINT `RoomAmenity_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscriptionTransaction` ADD CONSTRAINT `SubscriptionTransaction_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
