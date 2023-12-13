-- CreateEnum
CREATE TYPE "sign_in_provider_enum" AS ENUM ('GOOGLE');

-- CreateEnum
CREATE TYPE "card_type_enum" AS ENUM ('CREDIT', 'VA', 'VR', 'VT');

-- CreateEnum
CREATE TYPE "card_network_enum" AS ENUM ('VISA', 'MASTERCARD', 'ELO', 'SODEXO');

-- CreateEnum
CREATE TYPE "icon_enum" AS ENUM ('house', 'shopping-cart', 'baby', 'tv', 'medkit', 'kiss', 'suitcase', 'beach', 'question', 'upload', 'download', 'transfer', 'ad', 'crown', 'pencil', 'logout', 'trashcan', 'pluscircle', 'google', 'email', 'phone', 'invoice', 'plus', 'wallet', 'gear', 'arrow-left', 'less-than', 'more-than', 'triangle-down', 'info', 'bank', 'card', 'ticket', 'category', 'pdf', 'tag', 'bell', 'connect', 'profile', 'eye-slash', 'clock', 'computer', 'calendar', 'money-bag');

-- CreateEnum
CREATE TYPE "transaction_type_enum" AS ENUM ('IN', 'OUT', 'TRANSFER');

-- CreateEnum
CREATE TYPE "payment_method_enum" AS ENUM ('CARD', 'BANK_ACCOUNT');

-- CreateEnum
CREATE TYPE "ca_formula_enum" AS ENUM ('EXACT_AMOUNT', 'MBWOPM', 'MBDOPM', 'DPFET');

-- CreateEnum
CREATE TYPE "recurrence_frequency_enum" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'SEMI_MONTHLY', 'QUARTERLY', 'ANNUALLY', 'SEMI_ANNUALLY');

-- CreateEnum
CREATE TYPE "days_of_week_enum" AS ENUM ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');

-- CreateEnum
CREATE TYPE "month_enum" AS ENUM ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');

-- CreateEnum
CREATE TYPE "recurrence_conditions_enum" AS ENUM ('IN_WEEKDAY', 'IN_WEEKEND', 'IS_EVEN_DAY', 'IS_ODD_DAY', 'NOT_HOLIDAY', 'IF_NOT_BEFORE', 'IF_NOT_AFTER');

-- CreateTable
CREATE TABLE "accounts" (
    "id" CHAR(16) NOT NULL,
    "email" VARCHAR(150),
    "phone" VARCHAR(25),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sign_in_providers" (
    "account_id" CHAR(16) NOT NULL,
    "provider" "sign_in_provider_enum" NOT NULL,
    "provider_id" VARCHAR(50) NOT NULL,
    "access_token" VARCHAR(150) NOT NULL,
    "refresh_token" VARCHAR(150) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sign_in_providers_pkey" PRIMARY KEY ("account_id","provider","provider_id")
);

-- CreateTable
CREATE TABLE "configs" (
    "account_id" CHAR(16) NOT NULL,
    "name" VARCHAR(20),
    "current_budget_id" CHAR(16),
    "salary_id" CHAR(16),

    CONSTRAINT "configs_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "magic_link_codes" (
    "account_id" CHAR(16) NOT NULL,
    "code" CHAR(32) NOT NULL,
    "is_first_access" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "magic_link_codes_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "account_id" CHAR(16) NOT NULL,
    "refresh_token" CHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("account_id","refresh_token")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" CHAR(16) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "icon" VARCHAR(50) NOT NULL,
    "color" CHAR(7) NOT NULL,
    "icon_color" CHAR(7) NOT NULL,
    "monthly_price" SMALLINT NOT NULL,
    "yearly_price" SMALLINT NOT NULL,
    "bank_accounts" SMALLINT NOT NULL,
    "postpaid_card" SMALLINT NOT NULL,
    "prepaid_card" SMALLINT NOT NULL,
    "categories" SMALLINT NOT NULL,
    "transactions_per_month" SMALLINT NOT NULL,
    "recurrent_transactions" SMALLINT NOT NULL,
    "reports" SMALLINT NOT NULL,
    "tags" SMALLINT NOT NULL,
    "reminders" SMALLINT NOT NULL,
    "bank_integrations" SMALLINT NOT NULL,
    "budgets" SMALLINT NOT NULL,
    "web" BOOLEAN NOT NULL,
    "ctl_bpm" BOOLEAN NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_subscriptions" (
    "id" CHAR(16) NOT NULL,
    "account_id" CHAR(16) NOT NULL,
    "subscription_id" CHAR(16) NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_renewal_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms_and_policies" (
    "sem_ver" CHAR(5) NOT NULL,
    "terms_of_use" VARCHAR(10000) NOT NULL,
    "privacy_policy" VARCHAR(10000) NOT NULL,
    "live_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "terms_and_policies_pkey" PRIMARY KEY ("sem_ver")
);

-- CreateTable
CREATE TABLE "terms_and_policies_accepteds" (
    "account_id" CHAR(16) NOT NULL,
    "sem_ver" CHAR(5) NOT NULL,
    "accepted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "terms_and_policies_accepteds_pkey" PRIMARY KEY ("account_id","sem_ver")
);

-- CreateTable
CREATE TABLE "bank_providers" (
    "id" CHAR(16) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "code" CHAR(3) NOT NULL,
    "icon_url" VARCHAR(200) NOT NULL,
    "color" CHAR(7) NOT NULL,

    CONSTRAINT "bank_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" CHAR(16) NOT NULL,
    "account_id" CHAR(16) NOT NULL,
    "bank_provider_id" CHAR(16) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "account_number" CHAR(6) NOT NULL,
    "branch" CHAR(4) NOT NULL,
    "balance" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_providers" (
    "id" CHAR(16) NOT NULL,
    "bank_provider_id" CHAR(16) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "icon_url" VARCHAR(200) NOT NULL,
    "color" CHAR(7) NOT NULL,
    "type" "card_type_enum" NOT NULL,
    "network" "card_network_enum" NOT NULL,
    "statement_days" SMALLINT NOT NULL,

    CONSTRAINT "card_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" CHAR(16) NOT NULL,
    "account_id" CHAR(16) NOT NULL,
    "card_provider_id" CHAR(16) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "last_four_digits" CHAR(4) NOT NULL,
    "due_day" SMALLINT,
    "limit" INTEGER,
    "balance" INTEGER,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "default_categories" (
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "icon" "icon_enum" NOT NULL,
    "color" CHAR(7) NOT NULL,

    CONSTRAINT "default_categories_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" CHAR(16) NOT NULL,
    "account_id" CHAR(16) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "icon" "icon_enum" NOT NULL,
    "color" CHAR(7) NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgets" (
    "id" CHAR(16) NOT NULL,
    "account_id" CHAR(16) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(300) NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_dates" (
    "id" CHAR(16) NOT NULL,
    "budget_id" CHAR(16) NOT NULL,
    "month" SMALLINT NOT NULL,
    "year" SMALLINT NOT NULL,

    CONSTRAINT "budget_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_items" (
    "budget_date_id" CHAR(16) NOT NULL,
    "category_id" CHAR(16) NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "budget_items_pkey" PRIMARY KEY ("budget_date_id","category_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" CHAR(16) NOT NULL,
    "account_id" CHAR(16) NOT NULL,
    "type" "transaction_type_enum" NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "amount" INTEGER NOT NULL,
    "budget_date_id" CHAR(16) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_system_managed" BOOLEAN NOT NULL,
    "recurrent_transaction_id" CHAR(16),
    "payment_method" "payment_method_enum",
    "category_id" CHAR(16),
    "card_id" CHAR(16),
    "bank_account_id" CHAR(16),
    "bank_account_from_id" CHAR(16),
    "bank_account_to_id" CHAR(16),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installments" (
    "transaction_id" CHAR(16) NOT NULL,
    "total" SMALLINT NOT NULL,
    "current" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "installments_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "recurrent_transactions" (
    "id" CHAR(16) NOT NULL,
    "account_id" CHAR(16) NOT NULL,
    "budget_id" CHAR(16) NOT NULL,
    "is_system_managed" BOOLEAN NOT NULL,
    "type" "transaction_type_enum" NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_system_managed_t" BOOLEAN NOT NULL,
    "payment_method" "payment_method_enum",
    "category_id" CHAR(16),
    "card_id" CHAR(16),
    "bank_account_id" CHAR(16),
    "bank_account_from_id" CHAR(16),
    "bank_account_to_id" CHAR(16),

    CONSTRAINT "recurrent_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurrent_transaction_rules" (
    "id" CHAR(16) NOT NULL,
    "recurrent_transaction_id" CHAR(16) NOT NULL,
    "ca_formula" "ca_formula_enum" NOT NULL,
    "ca_params" VARCHAR NOT NULL,
    "ca_conditions" "recurrence_conditions_enum"[],
    "frequency" "recurrence_frequency_enum" NOT NULL,
    "f_days_of_weeks" "days_of_week_enum"[],
    "f_days_of_the_months" TEXT[],
    "f_months" "month_enum"[],
    "f_conditions" "recurrence_conditions_enum"[],

    CONSTRAINT "recurrent_transaction_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_phone_key" ON "accounts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "configs_current_budget_id_key" ON "configs"("current_budget_id");

-- CreateIndex
CREATE UNIQUE INDEX "configs_salary_id_key" ON "configs"("salary_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_refresh_token_key" ON "refresh_tokens"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_account_id_bank_provider_id_account_number_key" ON "bank_accounts"("account_id", "bank_provider_id", "account_number");

-- CreateIndex
CREATE UNIQUE INDEX "cards_card_provider_id_last_four_digits_key" ON "cards"("card_provider_id", "last_four_digits");

-- CreateIndex
CREATE UNIQUE INDEX "budget_dates_budget_id_month_year_key" ON "budget_dates"("budget_id", "month", "year");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "Config_id_fkey" FOREIGN KEY ("id") REFERENCES "configs"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "MagicLinkCode_id_fkey" FOREIGN KEY ("id") REFERENCES "magic_link_codes"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sign_in_providers" ADD CONSTRAINT "sign_in_providers_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configs" ADD CONSTRAINT "configs_current_budget_id_fkey" FOREIGN KEY ("current_budget_id") REFERENCES "budgets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configs" ADD CONSTRAINT "configs_salary_id_fkey" FOREIGN KEY ("salary_id") REFERENCES "recurrent_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms_and_policies_accepteds" ADD CONSTRAINT "terms_and_policies_accepteds_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms_and_policies_accepteds" ADD CONSTRAINT "terms_and_policies_accepteds_sem_ver_fkey" FOREIGN KEY ("sem_ver") REFERENCES "terms_and_policies"("sem_ver") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_bank_provider_id_fkey" FOREIGN KEY ("bank_provider_id") REFERENCES "bank_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_providers" ADD CONSTRAINT "card_providers_bank_provider_id_fkey" FOREIGN KEY ("bank_provider_id") REFERENCES "bank_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_card_provider_id_fkey" FOREIGN KEY ("card_provider_id") REFERENCES "card_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_dates" ADD CONSTRAINT "budget_dates_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_budget_date_id_fkey" FOREIGN KEY ("budget_date_id") REFERENCES "budget_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_budget_date_id_fkey" FOREIGN KEY ("budget_date_id") REFERENCES "budget_dates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bank_account_from_id_fkey" FOREIGN KEY ("bank_account_from_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bank_account_to_id_fkey" FOREIGN KEY ("bank_account_to_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_fkey" FOREIGN KEY ("id") REFERENCES "installments"("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "recurrent_transaction_rules" ADD CONSTRAINT "recurrent_transaction_rules_recurrent_transaction_id_fkey" FOREIGN KEY ("recurrent_transaction_id") REFERENCES "recurrent_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
