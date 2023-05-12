import { PrismaClient } from '@prisma/client'
import { crudService } from '../../utils/crud/prismaCrud'

const prisma = new PrismaClient()

const filesModel = crudService(prisma.files)

export { filesModel, prisma }
