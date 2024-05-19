/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose'
import { IAdmin } from '../admin/admin.interface'
import { IFaculty } from '../faculty/faculty.interface'
import { IStudent } from '../student/student.interface'

export type IUser = {
  id: string
  role: string
  password: string
  needsPasswordChange: boolean
  passwordChangedAt?: Date
  student?: Types.ObjectId | IStudent
  faculty?: Types.ObjectId | IFaculty
  admin?: Types.ObjectId | IAdmin
}

// user Model type
export type UserModel = {
  // static methods 1
  isUserExist(
    id: string,
    //Pick is used for selecting the properties from the object type IUser
  ): Promise<Pick<IUser, 'id' | 'role' | 'password' | 'needsPasswordChange'>>
  // static methods 2
  isPasswordMatched(
    givenPassword: string, // new password
    savedPassword: string, // old password
  ): Promise<boolean>
} & Model<IUser>
