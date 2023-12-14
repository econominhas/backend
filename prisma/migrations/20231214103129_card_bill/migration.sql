/*
  Warnings:

  - You are about to drop the column `rtBillId` on the `cards` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rt_bill_id]` on the table `cards` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_rtBillId_fkey";

-- DropIndex
DROP INDEX "cards_rtBillId_key";

-- AlterTable
ALTER TABLE "cards" DROP COLUMN "rtBillId",
ADD COLUMN     "rt_bill_id" CHAR(16);

-- CreateIndex
CREATE UNIQUE INDEX "cards_rt_bill_id_key" ON "cards"("rt_bill_id");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_rt_bill_id_fkey" FOREIGN KEY ("rt_bill_id") REFERENCES "recurrent_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
