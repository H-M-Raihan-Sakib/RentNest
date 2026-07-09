-- AlterEnum
ALTER TYPE "ActiveStatus" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[];
