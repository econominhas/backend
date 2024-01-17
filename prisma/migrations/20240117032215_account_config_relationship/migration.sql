/*
  Warnings:

  - You are about to drop the column `rt_bill_id` on the `cards` table. All the data in the column will be lost.
  - The primary key for the `configs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `installments` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `recurrent_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[account_id]` on the table `configs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `configs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installment_group_id` to the `installments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "pay_at_enum" AS ENUM ('STATEMENT', 'DUE');

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "Config_id_fkey";

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "MagicLinkCode_id_fkey";

-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_rt_bill_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_id_fkey";

-- DropIndex
DROP INDEX "cards_rt_bill_id_key";

-- AlterTable
ALTER TABLE "cards" DROP COLUMN "rt_bill_id",
ADD COLUMN     "pay_at" "pay_at_enum",
ADD COLUMN     "pay_with_id" TEXT;

-- AlterTable
ALTER TABLE "configs" DROP CONSTRAINT "configs_pkey",
ADD COLUMN     "id" CHAR(16) NOT NULL,
ADD CONSTRAINT "configs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "installments" DROP COLUMN "created_at",
ADD COLUMN     "card_bill_id" CHAR(16),
ADD COLUMN     "installment_group_id" CHAR(16) NOT NULL;

-- AlterTable
ALTER TABLE "recurrent_transactions" DROP COLUMN "payment_method";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "payment_method";

-- DropEnum
DROP TYPE "payment_method_enum";

-- CreateTable
CREATE TABLE "card_bills" (
    "id" CHAR(16) NOT NULL,
    "card_id" CHAR(16) NOT NULL,
    "month" DATE NOT NULL,
    "start_at" DATE NOT NULL,
    "end_at" DATE NOT NULL,
    "statement_date" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "paid_at" TIMESTAMP,
    "payment_transaction_id" TEXT,

    CONSTRAINT "card_bills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "card_bills_payment_transaction_id_key" ON "card_bills"("payment_transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "card_bills_card_id_month_key" ON "card_bills"("card_id", "month");

-- CreateIndex
CREATE UNIQUE INDEX "configs_account_id_key" ON "configs"("account_id");

-- AddForeignKey
ALTER TABLE "configs" ADD CONSTRAINT "configs_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "magic_link_codes" ADD CONSTRAINT "MagicLinkCode_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_pay_with_id_fkey" FOREIGN KEY ("pay_with_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_bills" ADD CONSTRAINT "card_bills_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_bills" ADD CONSTRAINT "card_bills_payment_transaction_id_fkey" FOREIGN KEY ("payment_transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_card_bill_id_fkey" FOREIGN KEY ("card_bill_id") REFERENCES "card_bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
