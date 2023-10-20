/* eslint-disable no-console */
import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import config from '../../config/index'

import handleValidationError from '../../errors/handleValidationError'
import handleZodError from '../../errors/handleZodError'
import { IGenericErrorMessage } from '../../interfaces/error'
import { errorLogger } from '../../shared/logger'
import ApiError from '../../errors/ApiError'

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  config?.env === 'development'
    ? console.log(' Global error handler: ', error)
    : errorLogger.error('Global error handler: ', error)

  let statusCode = 500
  let message = 'something went wrong !'
  let errorMessages: IGenericErrorMessage[] = []

  if (error?.name === 'validationError') {
    //Validation Error
    const simplifiedError = handleValidationError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error instanceof ZodError) {
    // Zod Error
    const simplifiedError = handleZodError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
    // errorMessages = error?.message
    //   ? [
    //       {
    //         path: '',
    //         message: error?.message,
    //       },
    //     ]
    //   : [];
  } else if (error instanceof ApiError) {
    //Api Error
    statusCode = error.statusCode
    message = error.message
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : []
  } else if (error instanceof Error) {
    // Cast Error
    message = error?.message
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : []
  }
  // res.status(400).json({ Error: err })

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  })
  next()
}

export default globalErrorHandler
