/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `editedAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Particaipant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Particaipant` DROP FOREIGN KEY `Particaipant_conversation_id_fkey`;

-- DropForeignKey
ALTER TABLE `Particaipant` DROP FOREIGN KEY `Particaipant_user_id_fkey`;

-- AlterTable
ALTER TABLE `Conversation` ADD COLUMN `edited_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Message` DROP COLUMN `deletedAt`,
    DROP COLUMN `editedAt`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `edited_at` DATETIME(3) NULL;

-- DropTable
DROP TABLE `Particaipant`;

-- CreateTable
CREATE TABLE `Participant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conversation_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_read_message_id` INTEGER NULL,

    UNIQUE INDEX `Participant_conversation_id_user_id_key`(`conversation_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Participant` ADD CONSTRAINT `Participant_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `Conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Participant` ADD CONSTRAINT `Participant_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
