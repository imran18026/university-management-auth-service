/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt'
import { Schema, model } from 'mongoose'
import config from '../../../config'
import { IUser, UserModel } from './user.interface'

const UserSchema = new Schema<IUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0, // hide password from the response body (don't want to get password)
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student', // referring to the name of the model 'Student'
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty', // referring to the name of the model 'Faculty'
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin', // referring to the name of the model 'Admin'
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)

UserSchema.statics.isUserExist = async function (
  id: string,
): Promise<IUser | null> {
  return await User.findOne(
    { id },
    { id: 1, password: 1, role: 1, needsPasswordChange: 1 },
  )
}

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword) // password compare with hashed password
}

UserSchema.methods.changedPasswordAfterJwtIssued = function (
  jwtTimestamp: number,
) {
  console.log({ jwtTimestamp }, 'changed Password')
}

// User.create() / user.save()

// pre hook for hashing user password
UserSchema.pre('save', async function (next) {
  // hashing user password
  const user = this
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds),
  )
  if (!user.needsPasswordChange) {
    user.passwordChangedAt = new Date()
  }
  next()
})

export const User = model<IUser, UserModel>('User', UserSchema)
