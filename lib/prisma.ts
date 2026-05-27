import { PrismaClient } from '@prisma/client'

// Note: database-url.ts cannot be imported here because it uses Node.js modules (fs, os, path)
// which are not available in Edge Runtime (middleware). Instead, we use DATABASE_URL directly.
// For SSL certificate handling in production, set DATABASE_SSL_CA environment variable before
// creating a Prisma instance outside of Edge Runtime.

const prismaClientSingleton = () => {
  // Use DATABASE_URL environment variable directly
  // SSL certificate is handled by environment variables (DATABASE_SSL_CA, SSL_CA)
  // configured before the Prisma instance is created
  const url = process.env.DATABASE_URL

  return new PrismaClient(
    url
      ? {
          datasources: {
            db: { url },
          },
        }
      : undefined
  )
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
