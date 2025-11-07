// Temporary: Use stub from shared/api until Prisma client can be generated
import { PrismaClient } from "@shared/api";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? ["error"]
        : ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Helper function to safely disconnect Prisma client
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// Helper function to handle database errors
export function handlePrismaError(error: any) {
  console.error("Database error:", error);

  // Prisma-specific error handling
  if (error.code === "P2002") {
    return { error: "A record with this data already exists" };
  }

  if (error.code === "P2025") {
    return { error: "Record not found" };
  }

  if (error.code === "P2003") {
    return { error: "Invalid reference to related record" };
  }

  return { error: "Database operation failed" };
}
