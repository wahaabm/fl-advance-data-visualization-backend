import { Request, Response } from "express";
import jwt, { VerifyCallback } from "jsonwebtoken";
const privatekey:string = process.env.PRIVATE_KEY!;

export async function app(req: Request, res: Response): Promise<void> {
  if (!req.token) {
    console.log("Token is missing");
    res.sendStatus(403);
    return;
  }

  jwt.verify(req.token, privatekey, (err: any, authorizedData: any) => {
    if (err) {
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
      return;
    }
  
    const { role } = authorizedData;
    
    if (role === 'Admin') {
      // Serve admin dashboard
      res.json({ message: 'Welcome to the admin dashboard' });
    } else if (role === 'NORMAL_USER') {
      // Serve user page
      res.json({ message: 'Hello, user!' });
    } else {
      // Handle unrecognized role
      res.status(403).json({ message: 'Unauthorized role' });
    }
  });
}

export async function allowUser(req:Request,res:Response): Promise<void>{
  if (!req.token) {
    console.log("Token is missing");
    res.sendStatus(403);
    return;
  }
  jwt.verify(req.token, privatekey, (err: any, authorizedData: any) => {
    if (err) {
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
      return;
    }
  
    const { role } = authorizedData;
    
    if (role === 'ADMIN_USER') {
      // Serve admin dashboard
      res.json({ message: 'Welcome to the admin dashboard' });
    }  else {
      // Handle unrecognized role
      res.status(403).json({ message: 'Unauthorized role' });
    }
  });
}