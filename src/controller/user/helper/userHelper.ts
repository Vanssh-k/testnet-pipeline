import userUploads from '../../../db/file/userUploads.js'
import createTag from '../../../db/user/tag/createTag.js'
import getTagData from '../../../db/user/tag/getTagData.js'
import getAllTags from '../../../db/user/tag/getAllTags.js'
import removeTag from '../../../db/user/tag/removeTag.js'
import getFileByID from '../../../db/file/getFileByID.js'
import CustomError from '../../../middlewares/error/customError.js'

export const getUploads = async (publicKey: string, lastKey: string | undefined) => {
  let exclusiveStartKey = undefined
  if (lastKey) {
    const fileInfo = await getFileByID(lastKey)
    if (fileInfo) {
      exclusiveStartKey = {
        id: fileInfo.id,
        createdAt: fileInfo.createdAt,
        publicKey: publicKey,
      }
    }
  }
  const fileList = await userUploads(publicKey, exclusiveStartKey)
  return fileList
}

export const createTagHelper = async (tag: string, cid: string, publicKey: string): Promise<void> => {
  if (tag.includes(' ')) {
    throw new CustomError(400, 'tag cannot contain spaces')
  }
  await createTag({
    id: publicKey + '-' + tag,
    tag: tag,
    cid: cid,
    publicKey: publicKey,
    lastUpdate: Date.now(),
  })
}

export const getTagDetailsHelper = async (tag: string, publicKey: string) => {
  const tagDetails = await getTagData(publicKey + '-' + tag)
  return tagDetails
}

export const getAllTagsHelper = async (publicKey: string) => {
  const tags = await getAllTags(publicKey)
  return tags
}

export const removeTagHelper = async (tag: string, publicKey: string): Promise<void> => {
  await removeTag(publicKey + '-' + tag)
}
