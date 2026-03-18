-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('BACHELOR', 'MASTER', 'FORSCHUNGSPRAKTIKUM');

-- CreateEnum
CREATE TYPE "RequestedComputerType" AS ENUM ('POOL', 'PERSONALIZED');

-- CreateEnum
CREATE TYPE "RequestedOs" AS ENUM ('WINDOWS', 'LINUX');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "computers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ipAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "raumId" TEXT,
    "mitarbeiterId" TEXT,
    "studentId" TEXT,

    CONSTRAINT "computers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitarbeiter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "mitarbeiter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "pool" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raeume" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "raeume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workstation_requests" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mitarbeiterId" TEXT NOT NULL,
    "workTopic" TEXT NOT NULL,
    "workType" "WorkType" NOT NULL,
    "studentFirstName" TEXT NOT NULL,
    "studentLastName" TEXT NOT NULL,
    "studentIdm" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "requestedComputerType" "RequestedComputerType" NOT NULL,
    "requestedOs" "RequestedOs",
    "adminNote" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "workstation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "computers_name_key" ON "computers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "computers_studentId_key" ON "computers"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "mitarbeiter_email_key" ON "mitarbeiter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "raeume_name_key" ON "raeume"("name");

-- AddForeignKey
ALTER TABLE "computers" ADD CONSTRAINT "computers_raumId_fkey" FOREIGN KEY ("raumId") REFERENCES "raeume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "computers" ADD CONSTRAINT "computers_mitarbeiterId_fkey" FOREIGN KEY ("mitarbeiterId") REFERENCES "mitarbeiter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "computers" ADD CONSTRAINT "computers_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workstation_requests" ADD CONSTRAINT "workstation_requests_mitarbeiterId_fkey" FOREIGN KEY ("mitarbeiterId") REFERENCES "mitarbeiter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
