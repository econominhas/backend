-- CreateTable
CREATE TABLE "onboardings" (
    "id" CHAR(16) NOT NULL,
    "account_id" CHAR(16) NOT NULL,
    "name" TIMESTAMP,
    "categories" TIMESTAMP,
    "bank_accounts" TIMESTAMP,
    "credit_cards" TIMESTAMP,
    "budget" TIMESTAMP,
    "salary" TIMESTAMP,

    CONSTRAINT "onboardings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "onboardings_account_id_key" ON "onboardings"("account_id");

-- AddForeignKey
ALTER TABLE "onboardings" ADD CONSTRAINT "onboardings_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
