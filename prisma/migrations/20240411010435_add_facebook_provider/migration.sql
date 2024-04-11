-- AlterEnum
ALTER TYPE "sign_in_provider_enum" ADD VALUE 'FACEBOOK';

-- AlterTable
ALTER TABLE "sign_in_providers" ALTER COLUMN "access_token" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "refresh_token" DROP NOT NULL,
ALTER COLUMN "refresh_token" SET DATA TYPE VARCHAR(300);
