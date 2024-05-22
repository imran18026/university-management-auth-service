import { IAcademicSemester } from '../academicSemester/academicSemester.interface'
import { User } from './user.model'

// find last Student ID
export const findLastStudentId = async (): Promise<string | undefined> => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    { id: 1, _id: 0 },
  )
    .sort({
      createdAt: -1,
    })
    .lean()

  return lastStudent?.id ? lastStudent.id.substring(4) : undefined // 4th index to end of the string.
}

// generated student ID
export const generateStudentId = async (
  academicSemester: IAcademicSemester,
): Promise<string> => {
  const currentId =
    (await findLastStudentId()) || (0).toString().padStart(5, '0') //00000 00001 00002 (padStart make total digit 5 by adding 0 in front )
  //increment by 1
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0')
  //20 25
  incrementedId = `${academicSemester.year.substring(2)}${
    academicSemester.code
  }${incrementedId}`

  return incrementedId
}

// find last Faculty ID
export const findLastFacultyId = async (): Promise<string | undefined> => {
  const lastFaculty = await User.findOne({ role: 'faculty' }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean()

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined
}

export const generateFacultyId = async (): Promise<string> => {
  const currentId =
    (await findLastFacultyId()) || (0).toString().padStart(5, '0')
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0')
  incrementedId = `F-${incrementedId}`

  return incrementedId
}

// find last admin or super admin
export const findLastAdminId = async (): Promise<string | undefined> => {
  const lastAdmin = await User.findOne(
    { role: { $in: ['admin', 'super_admin'] }, id: { $exists: true } }, // find those where admin or super admin with id exists, id is not required to be there but i want to make sure that id exists.
    { id: 1, _id: 0 },
  )
    .sort({
      createdAt: -1,
    })
    .lean()

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined
}
export const generateAdminId = async (): Promise<string> => {
  const currentId = (await findLastAdminId()) || (0).toString().padStart(5, '0')
  let incrementedId = (Number(currentId) + 1).toString().padStart(5, '0')
  incrementedId = `A-${incrementedId}`

  return incrementedId
}
