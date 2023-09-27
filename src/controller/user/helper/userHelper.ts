import getNetwork from '../../../middlewares/getNetwork'
import userUploads from '../../../repository/file/userUploads'
import migrationRequestInfo from '../../../repository/migration/migrationRequestInfo'
import updateUserData from '../../../repository/user/updateUserData'
import updateMigrationCIDRecord from '../../../repository/migration/updateMigrationCIDRecord'
import NotFoundError from '../../../errors/not-found-error'
import { cacheFunction } from '../../../repository/db/cacheClient'
import { cacheClearTime } from '../../libs/constants'
import userDetails from '../../../repository/user/userDetails'
import createTag from '../../../repository/user/tag/createTag'
import getTagData from '../../../repository/user/tag/getTagData'
import getAllTags from '../../../repository/user/tag/getAllTags'
import removeTag from '../../../repository/user/tag/removeTag'

export const getUserFiles = async (publicKey: string, pageNo: number) => {
  const network = getNetwork(publicKey)
  if (network === 'evm') {
    publicKey = publicKey.toLowerCase()
  }
  const userInfo = await userDetails(publicKey, network)

  // Only cache first page
  // let fileList = []
  // if (pageNo === 1) {
  //   fileList = await cacheFunction(
  //     async () => userUploads(publicKey, pageNo),
  //     `getUpload-${publicKey}-page-${pageNo}`,
  //     cacheClearTime.day
  //   )
  // } else {
  // fileList = await userUploads(publicKey, pageNo)
  // }
  const fileList = await userUploads(publicKey, pageNo)

  return {
    fileList: fileList,
    totalFiles: userInfo ? userInfo.fileCount : 0,
  }
}

export const getUploads = async (publicKey: string, pageNo: number) => {
  const network = getNetwork(publicKey)
  if (network === 'evm') {
    publicKey = publicKey.toLowerCase()
  }

  const fileList = await userUploads(publicKey, pageNo)

  return fileList
}

// Scope for optimization here
export const updateDataUsage = async (
  record: any,
  requestId: string,
  enterprise: string
) => {
  if (enterprise === 'lighthouse') {
    // Get all CID
    const cidList = await migrationRequestInfo(requestId)
    if (!cidList) {
      /* istanbul ignore next */
      throw new NotFoundError()
    }

    // Sum usage for CID pinned but userDataUpdated is false
    let totalUsage = 0

    const requests = cidList
      .filter(
        (cid: any) =>
          !cid.userDataUpdated &&
          cid.cidStatus === 'pinned' &&
          cid.fileSizeInBytes
      )
      .map(async (cid: any) => {
        totalUsage += parseInt(cid.fileSizeInBytes, 10)
        await updateMigrationCIDRecord(cid.id, true)
      })

    await Promise.all(requests)
    const dataUsed = parseInt(record.dataUsed, 10) + totalUsage
    await updateUserData(record.publicKey, dataUsed)
    return 'Success'
  }
  // TODO handle data usage update for other entreprise
  return 'Success'
}

export const createTagHelper = async (
  tag: string,
  cid: string,
  publicKey: string
) => {
  const saveResponse = await createTag({
    id: publicKey + '-' + tag,
    tag: tag,
    cid: cid,
    publicKey: publicKey,
    lastUpdate: Date.now(),
  })
  return saveResponse
}

export const getTagDetailsHelper = async (tag: string, publicKey: string) => {
  const tagDetails = await getTagData(publicKey + '-' + tag)
  return tagDetails
}

export const getAllTagsHelper = async (publicKey: string) => {
  const tags = await getAllTags(publicKey)
  return tags
}

export const removeTagHelper = async (tag: string, publicKey: string) => {
  const tagDetails = await removeTag(publicKey + '-' + tag)
  return 'Success'
}
