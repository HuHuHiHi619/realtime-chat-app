import { RegisterInput } from "../types/auth";
import prisma from "../prisma/prismaClient";


export class AuthRepository {

    async checkExistingUser(email : string) {
        return await prisma.user.findUnique({ where : { email : email} })
    } 

    async registerUser(data : RegisterInput) {
        return await prisma.user.create({
            data : {
                email : data.email,
                username : data.username,
                password : data.password
            }
        })
        
    }
}