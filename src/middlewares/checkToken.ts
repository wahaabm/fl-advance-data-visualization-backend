import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
dotenv.config();
const privatekey: string = process.env.PRIVATE_KEY!;

declare global {
  namespace Express {
    interface Request {
      authorizedData?: JwtPayload;
    }
  }
}
declare global {
  namespace jwt {
    interface JwtPayload {
      id?: string;
      email?: string;
      role?: string;
    }
  }
}

const checkToken = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers['authorization'];

  if (typeof header !== 'undefined') {
    const bearer = header.split(' ');
    const token = bearer[1];

    if (!token) {
      res.sendStatus(401);
      return;
    }

    try {
      const authorizedData: JwtPayload = jwt.verify(
        token,
        privatekey,
      ) as JwtPayload;
      if (Date.now() >= authorizedData.exp! * 1000) {
        res.sendStatus(401);
        return;
      }
      req.authorizedData = authorizedData;

      next();
    } catch (err) {
      console.log('ERROR: Could not connect to the protected route');
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
};

export default checkToken;
