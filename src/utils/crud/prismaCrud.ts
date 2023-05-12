import { prisma } from '../../repository/db/prismaClient'
import { DynamicObject } from '../../types'

export const getOne =
  (model: any) =>
  async (data: DynamicObject = {}) => {
    try {
      return model.findFirst({
        where: {
          ...data,
        },
      })
    } catch (error) {
      return false
    }
  }

export const getManyByIndex =
  (model: any) =>
  async (data: DynamicObject = {}, massivePull = false) => {
    try {
      return model.findMany({
        where: data,
      })
    } catch (error) {
      console.log(error)
      return []
    }
  }

export const createOne = (model: any) => async (record: DynamicObject) => {
  try {
    return model.create({ data: record })
  } catch (error) {
    throw new Error()
  }
}

// export const updateOrCreate =
//   (model: any) => async (identifier: DynamicObject, record: DynamicObject) => {
//     try {
//       return model.upsert({
//         where: identifier,
//         update: record,
//         create: { ...record, ...identifier },
//       })
//     } catch (error) {
//       throw new Error()
//     }
//   }

export const updateOrCreateV2 =
  (model: any) =>
  async (
    identifier: DynamicObject,
    record: DynamicObject,
    key: string = 'id'
  ) => {
    try {
      const temp = await model.findFirstOrThrow({
        where: {
          ...identifier,
        },
      })
      return model.update({
        where: { id: temp[key] },
        data: { ...record, ...identifier },
      })
    } catch (error: any) {
      return model.create({ data: { ...record, ...identifier } })
    }
  }

export const updateOne =
  (model: any) => async (identifier: DynamicObject, data: DynamicObject) => {
    try {
      return model.update({
        where: identifier,
        data,
      })
    } catch (error) {
      console.log(error)
      return null
    }
  }

export const crudService = (model: any) => ({
  updateOne: updateOne(model),
  getManyByIndex: getManyByIndex(model),
  getOne: getOne(model),
  createOne: createOne(model),
  updateOrCreate: updateOrCreateV2(model),
})
