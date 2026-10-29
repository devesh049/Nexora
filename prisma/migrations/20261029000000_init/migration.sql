CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'TEAM');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PAST_DUE', 'CANCELED', 'TRIALING');
CREATE TYPE "ActivityType" AS ENUM ('APP_OPENED', 'TOOL_OPENED', 'PROFILE_UPDATED', 'API_KEY_CREATED', 'API_KEY_REVOKED');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" TIMESTAMP(3),
  "image" TEXT,
  "passwordHash" TEXT NOT NULL,
  "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "User_status_createdAt_idx" ON "User"("status", "createdAt");

CREATE TABLE "UserProfile" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
  "preferences" JSONB NOT NULL DEFAULT '{}',
  "theme" TEXT NOT NULL DEFAULT 'system',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Application" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "icon" TEXT,
  "image" TEXT,
  "destination" TEXT,
  "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
  "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
  "requiredPlan" "Plan" NOT NULL DEFAULT 'FREE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Application_status_visibility_category_idx" ON "Application"("status", "visibility", "category");

CREATE TABLE "ToolCatalogItem" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "icon" TEXT,
  "route" TEXT NOT NULL UNIQUE,
  "status" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "ToolCatalogItem_status_category_idx" ON "ToolCatalogItem"("status", "category");

INSERT INTO "ToolCatalogItem" ("id", "name", "slug", "description", "category", "icon", "route", "status") VALUES
  ('tool_json_formatter', 'JSON Formatter', 'json-formatter', 'Format, validate, and beautify JSON data', 'Developer', 'Braces', '/tools/json-formatter', 'PUBLISHED'),
  ('tool_base64_encoder', 'Base64 Encoder', 'base64-encoder', 'Encode and decode Base64 strings', 'Developer', 'Binary', '/tools/base64-encoder', 'PUBLISHED'),
  ('tool_text_case', 'Text Case Converter', 'text-case-converter', 'Convert text between different cases', 'Text', 'CaseSensitive', '/tools/text-case-converter', 'PUBLISHED'),
  ('tool_word_counter', 'Word Counter', 'word-counter', 'Count words, characters, and sentences', 'Text', 'Type', '/tools/word-counter', 'PUBLISHED'),
  ('tool_url_encoder', 'URL Encoder', 'url-encoder', 'Encode and decode URL strings', 'Developer', 'Link', '/tools/url-encoder', 'PUBLISHED'),
  ('tool_qr_generator', 'QR Code Generator', 'qr-generator', 'Create and download QR codes for links and text', 'Utilities', 'QrCode', '/tools/qr-generator', 'PUBLISHED'),
  ('tool_password_generator', 'Password Generator', 'password-generator', 'Generate cryptographically secure random passwords', 'Security', 'Key', '/tools/password-generator', 'PUBLISHED'),
  ('tool_color_picker', 'Color Picker', 'color-picker', 'Pick and convert colors between formats', 'Design', 'Palette', '/tools/color-picker', 'PUBLISHED'),
  ('tool_uuid_generator', 'UUID Generator', 'uuid-generator', 'Generate unique identifiers (UUIDs)', 'Developer', 'Fingerprint', '/tools/uuid-generator', 'PUBLISHED');

CREATE TABLE "Favorite" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "applicationId" TEXT REFERENCES "Application"("id") ON DELETE CASCADE,
  "toolSlug" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Favorite_resource_check" CHECK (("applicationId" IS NOT NULL)::int + ("toolSlug" IS NOT NULL)::int = 1)
);
CREATE UNIQUE INDEX "Favorite_userId_applicationId_key" ON "Favorite"("userId", "applicationId");
CREATE UNIQUE INDEX "Favorite_userId_toolSlug_key" ON "Favorite"("userId", "toolSlug");
CREATE INDEX "Favorite_userId_createdAt_idx" ON "Favorite"("userId", "createdAt");

CREATE TABLE "UserActivity" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type" "ActivityType" NOT NULL,
  "applicationId" TEXT REFERENCES "Application"("id") ON DELETE SET NULL,
  "toolSlug" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "UserActivity_userId_createdAt_idx" ON "UserActivity"("userId", "createdAt");
CREATE INDEX "UserActivity_type_createdAt_idx" ON "UserActivity"("type", "createdAt");

CREATE TABLE "Subscription" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "plan" "Plan" NOT NULL DEFAULT 'FREE',
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
  "providerCustomerId" TEXT,
  "providerSubscriptionId" TEXT UNIQUE,
  "currentPeriodStart" TIMESTAMP(3),
  "currentPeriodEnd" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

CREATE TABLE "ApiKey" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "prefix" TEXT NOT NULL UNIQUE,
  "hashedKey" TEXT NOT NULL UNIQUE,
  "permissions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "lastUsedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "ApiKey_userId_revokedAt_idx" ON "ApiKey"("userId", "revokedAt");

CREATE TABLE "UsageRecord" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "apiKeyId" TEXT REFERENCES "ApiKey"("id") ON DELETE SET NULL,
  "resource" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "UsageRecord_userId_createdAt_idx" ON "UsageRecord"("userId", "createdAt");
CREATE INDEX "UsageRecord_apiKeyId_createdAt_idx" ON "UsageRecord"("apiKeyId", "createdAt");
CREATE INDEX "UsageRecord_resource_createdAt_idx" ON "UsageRecord"("resource", "createdAt");

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "actorUserId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "action" TEXT NOT NULL,
  "resourceType" TEXT NOT NULL,
  "resourceId" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON "AuditLog"("actorUserId", "createdAt");
CREATE INDEX "AuditLog_resourceType_resourceId_createdAt_idx" ON "AuditLog"("resourceType", "resourceId", "createdAt");

CREATE TABLE "PasswordResetToken" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL UNIQUE,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "PasswordResetToken_email_expiresAt_idx" ON "PasswordResetToken"("email", "expiresAt");

CREATE TABLE "RateLimitBucket" (
  "key" TEXT PRIMARY KEY,
  "count" INTEGER NOT NULL DEFAULT 1,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "RateLimitBucket_expiresAt_idx" ON "RateLimitBucket"("expiresAt");
