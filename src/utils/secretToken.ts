import jwt from "jsonwebtoken"
import dotenv from "dotenv"
const privatekey:string = process.env.PRIVATE_KEY!;
export default function createSecretToken(email:string, role:string){
    return jwt.sign({email,role}, privatekey   )
}