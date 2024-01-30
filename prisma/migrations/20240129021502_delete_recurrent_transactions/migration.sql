/*
  Warnings:

  - You are about to drop the column `salary_id` on the `configs` table. All the data in the column will be lost.
  - You are about to drop the `recurrent_transaction_rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recurrent_transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "configs" DROP CONSTRAINT "configs_salary_id_fkey";

-- DropForeignKey
ALTER TABLE "recurrent_transaction_rules" DROP CONSTRAINT "recurrent_transaction_rules_recurrent_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "recurrent_transactions" DROP CONSTRAINT "recurrent_transactions_account_id_fkey";

-- DropForeignKey
ALTER TABLE "recurrent_transactions" DROP CONSTRAINT "recurrent_transactions_bank_account_from_id_fkey";

-- DropForeignKey
ALTER TABLE "recurrent_transactions" DROP CONSTRAINT "recurrent_transactions_bank_account_id_fkey";

-- DropForeignKey
ALTER TABLE "recurrent_transactions" DROP CONSTRAINT "recurrent_transactions_bank_account_to_id_fkey";

-- DropForeignKey
ALTER TABLE "recurrent_transactions" DROP CONSTRAINT "recurrent_transactions_budget_id_fkey";

-- DropForeignKey
ALTER TABLE "recurrent_transactions" DROP CONSTRAINT "recurrent_transactions_card_id_fkey";

-- DropForeignKey
ALTER TABLE "recurrent_transactions" DROP CONSTRAINT "recurrent_transactions_category_id_fkey";

-- DropIndex
DROP INDEX "configs_salary_id_key";

-- AlterTable
ALTER TABLE "configs" DROP COLUMN "salary_id";

-- DropTable
DROP TABLE "recurrent_transaction_rules";

-- DropTable
DROP TABLE "recurrent_transactions";

-- DropEnum
DROP TYPE "ca_formula_enum";

-- DropEnum
DROP TYPE "recurrence_conditions_enum";

-- DropEnum
DROP TYPE "recurrence_frequency_enum";
