import { Request, Response, NextFunction } from 'express';

// This function receives the async function(fn) from the controller,
// and then return a new anonymous function.
// So as soon as the middleware handler is called, the anonymous function
// will simply return the function received as parameter 'fn'
// but with the .catch(next) to pass any error that may occur in the
// async function into the next function. This way being handled by the global error handler
const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next); // so if it is a request to create a new title for example, it is here that the function will be called to do it, that's why it needs to have the same signature as in the controller: (req, res, next)
  };
};

// The async fn returns a promise, and therefore, in case
// there is an error in this promise(the promise gets rejected),
// we can then catch the error that happened using the catch method,
// that is available on all promises.

export default catchAsync;
