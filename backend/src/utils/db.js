const { PrismaClient } = require("@prisma/client");

// Reuse a single Prisma client across the app instead of creating a new
// connection on every request.
const prisma = new PrismaClient();

module.exports = prisma;
