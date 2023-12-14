/*
  Warnings:

  - You are about to drop the column `f_days_of_the_months` on the `recurrent_transaction_rules` table. All the data in the column will be lost.
  - You are about to drop the column `f_days_of_weeks` on the `recurrent_transaction_rules` table. All the data in the column will be lost.
  - You are about to drop the column `f_months` on the `recurrent_transaction_rules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rtBillId]` on the table `cards` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `f_params` to the `recurrent_transaction_rules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ca_formula_enum" ADD VALUE 'CCB';

-- AlterEnum
ALTER TYPE "transaction_type_enum" ADD VALUE 'CREDIT';

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "rtBillId" CHAR(16);

-- AlterTable
ALTER TABLE "recurrent_transaction_rules" DROP COLUMN "f_days_of_the_months",
DROP COLUMN "f_days_of_weeks",
DROP COLUMN "f_months",
ADD COLUMN     "f_params" VARCHAR NOT NULL;

-- DropEnum
DROP TYPE "days_of_week_enum";

-- DropEnum
DROP TYPE "month_enum";

-- CreateIndex
CREATE UNIQUE INDEX "cards_rtBillId_key" ON "cards"("rtBillId");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_rtBillId_fkey" FOREIGN KEY ("rtBillId") REFERENCES "recurrent_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
