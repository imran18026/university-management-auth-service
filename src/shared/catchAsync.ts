import { NextFunction, Request, RequestHandler, Response } from 'express'

const catchAsync =
  (requestFn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await requestFn(req, res, next)
    } catch (error) {
      next(error)
    }
  }

export default catchAsync
