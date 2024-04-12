/*
  Warnings:

  - You are about to drop the `onboardings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salaries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salary_recurrent_transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "onboardings" DROP CONSTRAINT "onboardings_account_id_fkey";

-- DropForeignKey
ALTER TABLE "salaries" DROP CONSTRAINT "salaries_account_id_fkey";

-- DropForeignKey
ALTER TABLE "salary_recurrent_transactions" DROP CONSTRAINT "salary_recurrent_transactions_recurrent_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "salary_recurrent_transactions" DROP CONSTRAINT "salary_recurrent_transactions_salary_id_fkey";

-- DropTable
DROP TABLE "onboardings";

-- DropTable
DROP TABLE "salaries";

-- DropTable
DROP TABLE "salary_recurrent_transactions";

-- DropEnum
DROP TYPE "employment_contract_type_enum";

-- DropEnum
DROP TYPE "salary_type_enum";
