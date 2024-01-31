/*
  Warnings:

  - The values [VA,VR,VT] on the enum `card_type_enum` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `variant` to the `card_providers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "card_variant_enum" AS ENUM ('ENTRY_LEVEL', 'MID_MARKET', 'PREMIUM', 'SUPER_PREMIUM', 'ULTRA_PREMIUM', 'VA', 'VR', 'VT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "card_network_enum" ADD VALUE 'AMEX';
ALTER TYPE "card_network_enum" ADD VALUE 'ALELO';
ALTER TYPE "card_network_enum" ADD VALUE 'PLUXEE';
ALTER TYPE "card_network_enum" ADD VALUE 'TICKET';
ALTER TYPE "card_network_enum" ADD VALUE 'VR';

-- AlterEnum
BEGIN;
CREATE TYPE "card_type_enum_new" AS ENUM ('CREDIT', 'BENEFIT');
ALTER TABLE "card_providers" ALTER COLUMN "type" TYPE "card_type_enum_new" USING ("type"::text::"card_type_enum_new");
ALTER TYPE "card_type_enum" RENAME TO "card_type_enum_old";
ALTER TYPE "card_type_enum_new" RENAME TO "card_type_enum";
DROP TYPE "card_type_enum_old";
COMMIT;

-- AlterTable
ALTER TABLE "bank_providers" ADD COLUMN     "last_reviewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "card_providers" ADD COLUMN     "last_reviewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "variant" "card_variant_enum" NOT NULL,
ALTER COLUMN "bank_provider_id" DROP NOT NULL;
