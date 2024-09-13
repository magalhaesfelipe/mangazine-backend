class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message); // Passing message to the parent/super class 'Error'

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // We use this class to create errors, and the ones that we create are 'operational'

    // Capture the stack trace and exclude the constructor from it
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
