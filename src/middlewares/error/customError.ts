class CustomError extends Error {
  error?: any

  constructor(statusCode: number, error: string) {
    super(`${error}`)
    this.error = {
      code: statusCode,
      message: error,
    }

    Error.captureStackTrace(this, this.constructor)
  }

  serializeErrors() {
    return [{ message: this.error }]
  }
}

export default CustomError
