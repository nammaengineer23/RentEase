-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "PropertyVisit" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PropertyVisit_propertyId_idx" ON "PropertyVisit"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyVisit_tenantId_idx" ON "PropertyVisit"("tenantId");

-- CreateIndex
CREATE INDEX "PropertyVisit_visitDate_idx" ON "PropertyVisit"("visitDate");

-- AddForeignKey
ALTER TABLE "PropertyVisit" ADD CONSTRAINT "PropertyVisit_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyVisit" ADD CONSTRAINT "PropertyVisit_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
