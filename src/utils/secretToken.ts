import jwt from "jsonwebtoken"
import dotenv from "dotenv"
const privatekey:string = process.env.PRIVATE_KEY!;
export default function createSecretToken(id:number, email:string, role:string){
    return jwt.sign({id,email,role}, privatekey, {expiresIn:'1h'}   )
}