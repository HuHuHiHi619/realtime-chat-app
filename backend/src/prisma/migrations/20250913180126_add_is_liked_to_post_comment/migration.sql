-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `isLiked` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `isLiked` BOOLEAN NOT NULL DEFAULT false;
