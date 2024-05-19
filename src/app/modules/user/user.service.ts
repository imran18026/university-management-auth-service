import httpStatus from 'http-status'
import mongoose from 'mongoose'
import config from '../../../config/index'
import ApiError from '../../../errors/ApiError'
import { IAcademicSemester } from '../academicSemester/academicSemester.interface'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { IAdmin } from '../admin/admin.interface'
import { Admin } from '../admin/admin.model'
import { IFaculty } from '../faculty/faculty.interface'
import { Faculty } from '../faculty/faculty.model'
import { IStudent } from '../student/student.interface'
import { Student } from '../student/student.model'
import { IUser } from './user.interface'
import { User } from './user.model'
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils'

const createStudent = async (
  student: IStudent,
  user: IUser, //  userData
): Promise<IUser | null> => {
  // If password is not given, set default password
  if (!user.password) {
    user.password = config.default_student_pass as string
  }
  // set role
  user.role = 'student'

  //check student academic semester is valid or not from database
  const academicSemester = await AcademicSemester.findById(
    student.academicSemester,
  ).lean() // lean is used to convert mongoose object to javascript object for easy access to properties and return only necessary properties.

  if (!academicSemester) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This academic semester is not available now',
    )
  }

  let newUserAllData = null

  // start session
  const session = await mongoose.startSession()
  try {
    // start transaction
    session.startTransaction()
    // generate student id
    const id = await generateStudentId(academicSemester as IAcademicSemester)
    // set same custom id into both student & user
    user.id = id
    student.id = id

    // Create student using session
    const newStudent = await Student.create([student], { session })

    if (!newStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student.')
    }
    // set student _id (reference) into user.student [student _id => user.student as ObjectId as reference]
    user.student = newStudent[0]._id
    const newUser = await User.create([user], { session })

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user.')
    }
    newUserAllData = newUser[0]

    await session.commitTransaction()
    await session.endSession()

    // end session and transaction successfully completed.
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'student',
      populate: [
        {
          path: 'academicSemester',
        },
        {
          path: 'academicDepartment',
        },
        {
          path: 'academicFaculty',
        },
      ],
    })
  }

  return newUserAllData
}
// create faculty
const createFaculty = async (
  faculty: IFaculty,
  user: IUser, // userData,
): Promise<IUser | null> => {
  // If password is not given,set default password
  if (!user.password) {
    user.password = config.default_faculty_pass as string
  }

  // set role
  user.role = 'faculty'

  let newUserAllData = null
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    // generate faculty id
    const id = await generateFacultyId()
    // set custom id into both  faculty & user
    user.id = id
    faculty.id = id
    // Create faculty using sesssin
    const newFaculty = await Faculty.create([faculty], { session })

    if (!newFaculty.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty ')
    }
    // set faculty _id (reference) into user.student
    user.faculty = newFaculty[0]._id

    const newUser = await User.create([user], { session })

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty')
    }
    newUserAllData = newUser[0]

    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'faculty',
      populate: [
        {
          path: 'academicDepartment',
        },
        {
          path: 'academicFaculty',
        },
      ],
    })
  }

  return newUserAllData
}
// create admin
const createAdmin = async (
  admin: IAdmin,
  user: IUser, // userData,
): Promise<IUser | null> => {
  // If password is not given,set default password
  if (!user.password) {
    user.password = config.default_admin_pass as string
  }
  // set role
  user.role = 'admin'

  let newUserAllData = null
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    // generate admin id
    const id = await generateAdminId()
    user.id = id
    admin.id = id

    const newAdmin = await Admin.create([admin], { session })

    if (!newAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty ')
    }

    user.admin = newAdmin[0]._id

    const newUser = await User.create([user], { session })

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin')
    }
    newUserAllData = newUser[0]

    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
      path: 'admin',
      populate: [
        {
          path: 'managementDepartment',
        },
      ],
    })
  }

  return newUserAllData
}

export const UserService = {
  createStudent,
  createFaculty,
  createAdmin,
}
