import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const privatekey: string = process.env.PRIVATE_KEY!;

declare global {
    namespace Express {
      interface Request {
        authorizedData?: JwtPayload
      }
    }
    
  }
declare global{
  namespace jwt{
    interface JwtPayload{
      email?:string
      role?:string
    }
  }
}
  
  const checkToken = (req: Request, res: Response, next: NextFunction): void => {
      const header = req.headers['authorization'];
  
      if (typeof header !== 'undefined') {
          const bearer = header.split(' ');
          const token = bearer[1];
  
          if (!token) {
              res.sendStatus(403); // If token is not provided
              return;
          }
  
          try {
              const authorizedData:JwtPayload= jwt.verify(token, privatekey) as JwtPayload;
              req.authorizedData = authorizedData; // Optionally attach the token to the request object for further use
              next();
          } catch (err) {
              console.log("ERROR: Could not connect to the protected route");
              res.sendStatus(403);
          }
      } else {
          // If header is undefined, return Forbidden (403)
          res.sendStatus(403);
      }
  };
  
  

export default checkToken;
