/*
  Warnings:

  - Added the required column `date` to the `budget_dates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "budget_dates" ADD COLUMN     "date" DATE NOT NULL;
