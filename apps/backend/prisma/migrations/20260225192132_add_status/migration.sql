-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PROCESSING', 'COMPLETE', 'FAILED');

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'COMPLETE';
