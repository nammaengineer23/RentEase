-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'CHAT_MESSAGE';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "readAt" TIMESTAMP(3);
