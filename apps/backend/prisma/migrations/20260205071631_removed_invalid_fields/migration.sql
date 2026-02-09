/*
  Warnings:

  - The values [CHAT_CONTEXT] on the enum `AttachmentScope` will be removed. If these variants are still used in the database, this will fail.
  - The values [CODE_LAB] on the enum `MaterialType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `tutorChatId` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `materials` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AttachmentScope_new" AS ENUM ('MESSAGE');
ALTER TABLE "public"."message_attachments" ALTER COLUMN "scope" DROP DEFAULT;
ALTER TABLE "message_attachments" ALTER COLUMN "scope" TYPE "AttachmentScope_new" USING ("scope"::text::"AttachmentScope_new");
ALTER TYPE "AttachmentScope" RENAME TO "AttachmentScope_old";
ALTER TYPE "AttachmentScope_new" RENAME TO "AttachmentScope";
DROP TYPE "public"."AttachmentScope_old";
ALTER TABLE "message_attachments" ALTER COLUMN "scope" SET DEFAULT 'MESSAGE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MaterialType_new" AS ENUM ('FILE', 'NOTE', 'QUIZ', 'FLASHCARD_DECK', 'LESSON');
ALTER TABLE "materials" ALTER COLUMN "type" TYPE "MaterialType_new" USING ("type"::text::"MaterialType_new");
ALTER TYPE "MaterialType" RENAME TO "MaterialType_old";
ALTER TYPE "MaterialType_new" RENAME TO "MaterialType";
DROP TYPE "public"."MaterialType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "materials" DROP CONSTRAINT "materials_fileId_fkey";

-- DropForeignKey
ALTER TABLE "materials" DROP CONSTRAINT "materials_tutorChatId_fkey";

-- DropForeignKey
ALTER TABLE "materials" DROP CONSTRAINT "materials_userId_fkey";

-- DropIndex
DROP INDEX "materials_userId_tutorChatId_idx";

-- AlterTable
ALTER TABLE "materials" DROP COLUMN "createdAt",
DROP COLUMN "fileId",
DROP COLUMN "tutorChatId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "file_id" UUID,
ADD COLUMN     "tutor_chat_id" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "materials_user_id_tutor_chat_id_idx" ON "materials"("user_id", "tutor_chat_id");

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_tutor_chat_id_fkey" FOREIGN KEY ("tutor_chat_id") REFERENCES "tutor_chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
