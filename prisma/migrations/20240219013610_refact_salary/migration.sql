/*
  Warnings:

  - You are about to drop the column `salary_id` on the `configs` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "employment_contract_type_enum" AS ENUM ('CLT', 'PJ');

-- CreateEnum
CREATE TYPE "salary_type_enum" AS ENUM ('MONEY', 'BENEFIT_VA', 'BENEFIT_VT');

-- DropForeignKey
ALTER TABLE "configs" DROP CONSTRAINT "configs_salary_id_fkey";

-- DropIndex
DROP INDEX "configs_salary_id_key";

-- AlterTable
ALTER TABLE "configs" DROP COLUMN "salary_id";

-- CreateTable
CREATE TABLE "salaries" (
    "id" CHAR(16) NOT NULL,
    "account_id" CHAR(16) NOT NULL,
    "employment_contract_type" "employment_contract_type_enum" NOT NULL,
    "start_at" TIMESTAMP(3),

    CONSTRAINT "salaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_recurrent_transactions" (
    "id" CHAR(16) NOT NULL,
    "salary_id" CHAR(16) NOT NULL,
    "recurrent_transaction_id" CHAR(16) NOT NULL,
    "type" "salary_type_enum" NOT NULL,

    CONSTRAINT "salary_recurrent_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "salaries_account_id_key" ON "salaries"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "salary_recurrent_transactions_salary_id_type_key" ON "salary_recurrent_transactions"("salary_id", "type");

-- AddForeignKey
ALTER TABLE "salaries" ADD CONSTRAINT "salaries_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_recurrent_transactions" ADD CONSTRAINT "salary_recurrent_transactions_salary_id_fkey" FOREIGN KEY ("salary_id") REFERENCES "salaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_recurrent_transactions" ADD CONSTRAINT "salary_recurrent_transactions_recurrent_transaction_id_fkey" FOREIGN KEY ("recurrent_transaction_id") REFERENCES "recurrent_transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
