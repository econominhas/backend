/*
  Warnings:

  - The values [VR] on the enum `card_variant_enum` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `cost_type` to the `default_categories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "cost_type_enum" AS ENUM ('fixed', 'variable');

-- AlterEnum
BEGIN;
CREATE TYPE "card_variant_enum_new" AS ENUM ('ENTRY_LEVEL', 'MID_MARKET', 'PREMIUM', 'SUPER_PREMIUM', 'ULTRA_PREMIUM', 'VA', 'VT');
ALTER TABLE "card_providers" ALTER COLUMN "variant" TYPE "card_variant_enum_new" USING ("variant"::text::"card_variant_enum_new");
ALTER TYPE "card_variant_enum" RENAME TO "card_variant_enum_old";
ALTER TYPE "card_variant_enum_new" RENAME TO "card_variant_enum";
DROP TYPE "card_variant_enum_old";
COMMIT;

-- AlterTable
ALTER TABLE "default_categories" ADD COLUMN     "cost_type" "cost_type_enum" NOT NULL;
