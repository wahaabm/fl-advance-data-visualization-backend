import jwt from "jsonwebtoken"
import dotenv from "dotenv"
const privatekey:string = process.env.PRIVATE_KEY!;
export default function createSecretToken(id:string){
    return jwt.sign({id}, privatekey   )
}