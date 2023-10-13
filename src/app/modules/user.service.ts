//Note: service use for only business logic or database logic.

import config from '../../config'
import { IUser } from './user.interface'
import { User } from './user.model'
import { generatedUserID } from './user.utils'

const createUser = async (user: IUser): Promise<IUser | null> => {
  console.log(user)
  //auto generated incremental id
  const id = await generatedUserID()
  //user id
  user.id = id

  //default password
  if (!user.password) {
    user.password = config.student_default_password as string
  }

  const createdUser = await User.create(user)
  console.log(user)
  if (!createUser) {
    throw new Error('Faild to create user 😒')
  }
  return createdUser
}

export default {
  createUser,
}
