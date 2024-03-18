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
    } else {
      res.json({
        message: "Successful log in",
        authorizedData,
      });
      console.log("SUCCESS: Connected to protected route");
    }
  });
}
