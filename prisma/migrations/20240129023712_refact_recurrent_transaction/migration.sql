/*
  Warnings:

  - A unique constraint covering the columns `[salary_id]` on the table `configs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "recurrence_frequency_enum" AS ENUM ('DAILY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "recurrence_formula_enum" AS ENUM ('RAW_AMOUNT', 'PM_1WG', 'PM_2WG');

-- CreateEnum
CREATE TYPE "recurrence_create_enum" AS ENUM ('DAY_1', 'DAY_2', 'DAY_3', 'DAY_4', 'DAY_5', 'DAY_6', 'DAY_7', 'DAY_8', 'DAY_9', 'DAY_10', 'DAY_11', 'DAY_12', 'DAY_13', 'DAY_14', 'DAY_15', 'DAY_16', 'DAY_17', 'DAY_18', 'DAY_19', 'DAY_20', 'DAY_21', 'DAY_22', 'DAY_23', 'DAY_24', 'DAY_25', 'DAY_26', 'DAY_27', 'DAY_28', 'DAY_29_OR_LAST_DAY_OF_MONTH', 'DAY_30_OR_LAST_DAY_OF_MONTH', 'DAY_31_OR_LAST_DAY_OF_MONTH', 'FIFTH_BUSINESS_DAY', 'FIRST_DAY_OF_MONTH', 'LAST_DAY_OF_MONTH');

-- CreateEnum
CREATE TYPE "recurrence_exclude_enum" AS ENUM ('IN_BUSINESS_DAY', 'IN_WEEKEND', 'IN_HOLIDAY', 'NOT_IN_HOLIDAY');

-- CreateEnum
CREATE TYPE "recurrence_try_again_enum" AS ENUM ('IF_NOT_BEFORE', 'IF_NOT_AFTER');

-- AlterTable
ALTER TABLE "configs" ADD COLUMN     "salary_id" CHAR(16);

-- CreateTable
CREATE TABLE "recurrent_transactions" (
    "id" CHAR(16) NOT NULL,
    "account_id" CHAR(16) NOT NULL,
    "budget_id" CHAR(16) NOT NULL,
    "is_system_managed" BOOLEAN NOT NULL,
    "frequency" "recurrence_frequency_enum" NOT NULL,
    "formula_to_use" "recurrence_formula_enum" NOT NULL,
    "start_at" TIMESTAMP(3),
    "end_at" TIMESTAMP(3),
    "base_amounts" INTEGER[],
    "c_creates" "recurrence_create_enum"[],
    "c_excludes" "recurrence_exclude_enum"[],
    "c_try_agains" "recurrence_try_again_enum"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "transaction_type_enum" NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "is_system_managed_t" BOOLEAN NOT NULL,
    "category_id" CHAR(16),
    "card_id" CHAR(16),
    "bank_account_id" CHAR(16),
    "bank_account_from_id" CHAR(16),
    "bank_account_to_id" CHAR(16),

    CONSTRAINT "recurrent_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "configs_salary_id_key" ON "configs"("salary_id");

-- AddForeignKey
ALTER TABLE "configs" ADD CONSTRAINT "configs_salary_id_fkey" FOREIGN KEY ("salary_id") REFERENCES "recurrent_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurrent_transactions" ADD CONSTRAINT "recurrent_transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurrent_transactions" ADD CONSTRAINT "recurrent_transactions_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budgets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurrent_transactions" ADD CONSTRAINT "recurrent_transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurrent_transactions" ADD CONSTRAINT "recurrent_transactions_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurrent_transactions" ADD CONSTRAINT "recurrent_transactions_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurrent_transactions" ADD CONSTRAINT "recurrent_transactions_bank_account_from_id_fkey" FOREIGN KEY ("bank_account_from_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurrent_transactions" ADD CONSTRAINT "recurrent_transactions_bank_account_to_id_fkey" FOREIGN KEY ("bank_account_to_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
