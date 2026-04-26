/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'DRIVER');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('OCTANE', 'HYBRID', 'ELECTRIC', 'DIESEL', 'PETROL');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('NEW', 'USED');

-- CreateEnum
CREATE TYPE "RentStatus" AS ENUM ('PENDING', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "profileImage" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "image" TEXT,
    "fuelType" "FuelType" NOT NULL,
    "passengerCapacity" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "condition" "Condition" NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rents" (
    "id" TEXT NOT NULL,
    "status" "RentStatus" NOT NULL DEFAULT 'PENDING',
    "startingPoint" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bids" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "BidStatus" NOT NULL DEFAULT 'PENDING',
    "driverLocation" TEXT NOT NULL,
    "rentId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_createdAt_idx" ON "users"("email", "createdAt");

-- CreateIndex
CREATE INDEX "cars_id_idx" ON "cars"("id");

-- CreateIndex
CREATE INDEX "rents_carId_idx" ON "rents"("carId");

-- CreateIndex
CREATE INDEX "rents_userId_idx" ON "rents"("userId");

-- CreateIndex
CREATE INDEX "bids_rentId_idx" ON "bids"("rentId");

-- CreateIndex
CREATE INDEX "bids_driverId_idx" ON "bids"("driverId");

-- CreateIndex
CREATE INDEX "bids_status_idx" ON "bids"("status");

-- AddForeignKey
ALTER TABLE "rents" ADD CONSTRAINT "rents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rents" ADD CONSTRAINT "rents_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "rents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
