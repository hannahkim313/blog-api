/*
  Warnings:

  - Added the required column `url` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "url" VARCHAR(255) NOT NULL;
