/*
  Warnings:

  - You are about to alter the column `latitude` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,6)`.
  - You are about to alter the column `longitude` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,6)`.

*/
-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(9,6),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(9,6);
