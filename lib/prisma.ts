import { PrismaClient } from '@prisma/client'
import { resolveDatabaseUrl } from './database-url'

const prismaClientSingleton = () => {
  const url = resolveDatabaseUrl()

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
