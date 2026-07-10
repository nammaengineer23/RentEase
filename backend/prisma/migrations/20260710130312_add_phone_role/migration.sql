/*
  Warnings:

  - You are about to drop the column `browser` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `deviceId` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `deviceName` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `hashedToken` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `isRevoked` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `lastUsedAt` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "RefreshToken_userId_idx";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "browser",
DROP COLUMN "deviceId",
DROP COLUMN "deviceName",
DROP COLUMN "hashedToken",
DROP COLUMN "ipAddress",
DROP COLUMN "isRevoked",
DROP COLUMN "lastUsedAt",
DROP COLUMN "platform",
ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
DROP COLUMN "isVerified",
DROP COLUMN "passwordHash",
DROP COLUMN "photoUrl",
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");
