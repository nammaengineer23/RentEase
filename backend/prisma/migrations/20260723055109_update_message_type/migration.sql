-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'DOCUMENT');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "messageType" "MessageType" NOT NULL DEFAULT 'TEXT';
