import { User } from './user.model'

// find last id from database
export const findLastUserID = async () => {
  const lastUser = await User.findOne({}, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean()
  return lastUser?.id
}

export const generatedUserID = async () => {
  const currentId = (await findLastUserID()) || (0).toString().padStart(5, '0')
  const incementedID = (parseInt(currentId) + 1).toString().padStart(5, '0')
  return incementedID
}
