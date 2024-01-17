-- AlterTable
ALTER TABLE "sign_in_providers" ALTER COLUMN "access_token" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "refresh_token" SET DATA TYPE VARCHAR(250);
