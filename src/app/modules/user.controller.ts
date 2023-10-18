import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'

import { IUser } from './user.interface'
import { UserService } from './user.service'
import httpStatus from 'http-status'
import catchAsync from '../../shared/catchAsync'
import sendResponse from '../../shared/sendResponse'

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req.body
    const result = await UserService.createUser(user)

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    })
  },
)

export const UserController = {
  createUser,
}
