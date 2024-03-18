import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
      interface Request {
        token?: string;
      }
    }
  }
  
const checkToken = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers['authorization'];

  if (typeof header !== 'undefined') {
    const bearer = header.split(' ');
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    // If header is undefined, return Forbidden (403)
    res.sendStatus(403);
  }
};

export default checkToken;
