/*
  Warnings:

  - You are about to drop the column `passoword` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "passoword",
ADD COLUMN     "password" TEXT;
